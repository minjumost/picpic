import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import MainLayout from "../components/Layouts/MainLayout";
import { usePageExitEvent } from "../hooks/usePageExitEvent";
import { useSessionCode } from "../hooks/useSessionCode";
import { sendSessionStart } from "../sockets/sessionSocket";
import stompClient, { setHandlers } from "../sockets/stompClient";
interface User {
  memberId: number;
  nickname: string;
  color: string;
  profileImageUrl: string;
  isOwner: boolean;
  isMe: boolean;
}

const SLOT_COUNT = 6;

interface Slot {
  user?: User;
}

const WaitingPage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: SLOT_COUNT }, () => ({}))
  );
  const [dots, setDots] = useState("..");
  const [copied, setCopied] = useState(false);

  const mId = Number(sessionStorage.getItem("memberId"));
  const sessionCode = useSessionCode();
  const navigate = useNavigate();
  const roomUrl = `https://minipia.co.kr/roomPwd?r=${sessionCode}`;

  usePageExitEvent("WaitingPage");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === ".." ? "..." : ".."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // STOMP 메시지 핸들러 등록
  useEffect(() => {
    const handlers = {
      session_enter: (data: { participants: User[]; sessionId: number }) => {
        sessionStorage.setItem("sessionId", `${data.sessionId}`);
        const filledSlots = Array.from({ length: SLOT_COUNT }, (_, i) => ({
          user: data.participants[i],
        }));
        setSlots(filledSlots);
      },
      session_start: () =>
        navigate(`/photo?r=${sessionCode}`, { replace: true }),
      stroke_start: () =>
        navigate(`/decorate?r=${sessionCode}`, { replace: true }),
      session_exit: (data: { isOwner: boolean; memberId: number }) => {
        if (data.isOwner) {
          stompClient.deactivate();
          sessionStorage.clear();
          window.location.href = "/";
          alert("방장이 나가서 세션이 종료되었습니다.");
        }
        setSlots((prev) =>
          prev.map((slot) =>
            slot.user?.memberId === data.memberId ? {} : slot
          )
        );
      },
    };

    setHandlers(handlers);
  }, []);

  const handleStartPhoto = () => {
    const sessionId = Number(sessionStorage.getItem("sessionId"));
    if (!sessionId || !sessionCode) {
      console.error("세션 정보가 없습니다.");
      return;
    }
    sendSessionStart(sessionId, sessionCode);
    navigate(`/photo?r=${sessionCode}`, { replace: true });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <MainLayout
      title={`친구들을 기다리고 있어요 ${dots}`}
      description={["링크를 통해 친구들을 초대해보세요"]}
      footer={
        sessionStorage.getItem("isOwner") === "1" && (
          <Button label="시작하기" onClick={handleStartPhoto} />
        )
      }
    >
      <div className="flex flex-row gap-4">
        <button
          onClick={handleCopy}
          className={`w-full h-14 text-md font-semibold px-3 py-3 rounded-md transition-colors duration-200
          ${
            copied
              ? "bg-main1 text-white"
              : "bg-white text-md text-main1 font-semibold hover:bg-main1/10 border border-main1"
          }`}
        >
          {copied ? "링크 복사 완료" : "친구 초대"}
        </button>
        <button
          onClick={() => {
            stompClient.deactivate();
            sessionStorage.clear();
            window.location.href = "/";
          }}
          className="w-full h-14 text-md px-3 py-3 rounded-md transition-colors duration-200
              bg-white text-md text-main1 font-semibold hover:bg-main1/10 border border-main1
          "
        >
          나가기
        </button>
      </div>
      {/* 링크 복사 버튼 */}

      {/* 슬롯 목록 */}
      <div className="flex flex-col gap-3 w-full z-10">
        {slots.map((slot, index) => {
          const user = slot.user;
          return (
            <div
              key={index}
              className="h-15 flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <img
                      src={user.profileImageUrl}
                      alt="user"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-lg font-medium">{user.nickname}</span>
                  </div>
                  <div className="flex gap-2">
                    {user.isOwner && (
                      <div className="w-14 h-8 bg-main2 rounded-2xl font-semibold text-white flex items-center justify-center">
                        방장
                      </div>
                    )}
                    {user.memberId === mId && (
                      <div className="w-14 h-8 bg-main1 rounded-2xl font-semibold text-white flex items-center justify-center">
                        나
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-400 text-md">빈자리</div>
              )}
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default WaitingPage;

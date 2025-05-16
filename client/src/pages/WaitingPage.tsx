import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  connectAndEnterSession,
  sendSessionStart,
} from "../sockets/sessionSocket";
import stompClient, {
  initStompSession,
  setHandlers,
} from "../sockets/stompClient";
import { useSessionCode } from "../hooks/useSessionCode";
import { useStompStatusStore } from "../sockets/useStompStore";

interface User {
  memberId: number;
  nickname: string;
  color: string;
  profileImageUrl: string;
  isOwner: boolean;
  isMe: boolean;
}

const WaitingPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dots, setDots] = useState(".."); // ← 점 상태 관리

  const mId = Number(sessionStorage.getItem("memberId"));

  const { isConnected } = useStompStatusStore.getState();
  const sessionCode = useSessionCode();
  const navigate = useNavigate();

  // 점 애니메이션 useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === ".." ? "..." : ".."));
    }, 600); // 0.6초마다 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  useEffect(() => {
    const handlers = {
      session_enter: (data: { participants: User[]; sessionId: number }) => {
        sessionStorage.setItem("sessionId", `${data.sessionId}`);
        setUsers(data.participants);
      },
      session_start: () => navigate(`/photo?r=${sessionCode}`),
      stroke_start: () => navigate(`/decorate?r=${sessionCode}`),
      collage_start: () => navigate(`/final?r=${sessionCode}`),
      session_exit: (data: { isOwner: boolean; memberId: number }) => {
        if (data.isOwner) {
          stompClient.deactivate();
          sessionStorage.clear();
          navigate("/");
          alert("방장이 나가서 세션이 종료되었습니다.");
        }
        setUsers((prev) =>
          prev.filter((value: User) => value.memberId !== data.memberId)
        );
      },
    };

    setHandlers(handlers);
  }, [sessionCode, navigate]);

  // 재접속 로직
  useEffect(() => {
    const reConnect = async () => {
      await initStompSession(sessionCode);
      await connectAndEnterSession(sessionCode, 1234);
    };
    if (!isConnected) {
      reConnect();
    }
  }, [isConnected, sessionCode]);

  const handleStartPhoto = () => {
    const sessionId = Number(sessionStorage.getItem("sessionId"));

    if (!sessionId || !sessionCode) {
      console.error("세션 정보가 없습니다.");
      return;
    }

    sendSessionStart(sessionId, sessionCode);
    navigate(`/photo?r=${sessionCode}`);
  };

  return (
    <div className="flex flex-col justify-center w-full h-full p-4 gap-8">
      {/* 제목 */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-bold text-gray-800">
          친구들을 기다리고 있어요{dots}
        </h2>
        <p className="text-[18px] font-semibold text-gray-500">
          언제든 시작할 수 있어요
        </p>
      </div>

      {/* 참가자 목록 */}
      <div className="flex flex-col gap-3 w-full z-10 mb-6">
        {users.length > 0 &&
          users.map((user, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profileImageUrl}
                    alt="user"
                    className="w-8 h-8"
                  />
                  <span className="text-lg font-medium">{user.nickname}</span>
                </div>
                <div className="flex gap-1">
                  {user.isOwner && (
                    <div className="w-12 h-7 bg-main2 rounded-2xl text-white flex items-center justify-center">
                      방장
                    </div>
                  )}
                  {user.memberId === mId && (
                    <div className="w-12 h-7 bg-main1 rounded-2xl text-white flex items-center justify-center">
                      나
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* 시작하기 버튼 */}
      {sessionStorage.getItem("isOwner") === "1" && (
        <button
          className="w-full bg-main1 text-white font-semibold text-xl py-3 px-6 rounded-lg cursor-pointer"
          onClick={handleStartPhoto}
        >
          시작하기
        </button>
      )}
    </div>
  );
};

export default WaitingPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { sendSessionStart } from "../sockets/sessionSocket";
import { setHandlers } from "../sockets/stompClient";
import { useSessionCode } from "../hooks/useSessionCode";

interface User {
  memberId: number;
  nickname: string;
  color: string;
  profileImageUrl: string;
}

const WaitingPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const sessionCode = useSessionCode();

  useEffect(() => {
    const handlers = {
      session_enter: (data: { participants: User[] }) => {
        setUsers([...data.participants]);
      },
    };

    setHandlers(handlers);
  }, []);

  const navigate = useNavigate();

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
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">
        친구들을 기다리고 있어요..
      </h2>

      <p className="text-body1 font-bold text-gray-500 mb-6">
        다 모이지 않아도 시작할 수 있어요
      </p>

      <div className="flex flex-col gap-3 w-full z-10 mb-6">
        {users.length > 0 &&
          users.map((user, index) => (
            <div
              key={index}
              className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
            >
              <img
                src={user.profileImageUrl} // 사용자 이모지 (예시)
                alt="user"
                className="w-6 h-6 mr-2"
              />
              <span className="text-sm font-medium">{user.nickname}</span>
            </div>
          ))}
      </div>

      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={handleStartPhoto}
      >
        시작하기
      </button>
    </div>
  );
};

export default WaitingPage;

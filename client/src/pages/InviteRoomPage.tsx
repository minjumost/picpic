import { useNavigate } from "react-router";
import { useState } from "react";
import { initStompSession } from "../sockets/stompClient";
import { connectAndEnterSession } from "../sockets/sessionSocket";
import { useSessionCode } from "../hooks/useSessionCode";

const InviteRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const sessionCode = useSessionCode();
  const roomUrl = `https://localhost:5173/roomPwd?r=${sessionCode}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복원
    });
  };

  const handleEnterRoom = async () => {
    if (!sessionCode) {
      alert("방 코드가 없습니다.");
      return;
    }

    try {
      await initStompSession(sessionCode);
      await connectAndEnterSession(sessionCode, 1234);
      navigate(`/waiting?r=${sessionCode}`);
    } catch (error) {
      alert("방 입장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-full p-4 gap-8">
      {/* 제목 */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-bold text-gray-800">
          방 생성이 완료됐어요🥳
        </h2>
        <p className="text-[18px] font-semibold text-gray-500">
          링크를 복사해서 친구를 초대해보세요.
        </p>
      </div>

      {/* 링크 박스 + 복사 버튼 */}
      <div className="w-full flex items-center justify-between pl-3 p-0.5 rounded-lg border border-gray-300 bg-white text-gray-700">
        <span className="truncate mr-2 text-xl py-3">{roomUrl}</span>
        <button
          onClick={handleCopy}
          className={`w-24 h-full text-md font-semibold px-3 py-3 rounded-md transition-colors duration-200
              ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
        >
          {copied ? "Copyed" : "Copy"}
        </button>
      </div>

      <button
        className="py-3 rounded-lg font-semibold text-lg w-full bg-main1 text-white px-6 cursor-pointer"
        onClick={handleEnterRoom}
      >
        입장하기
      </button>
    </div>
  );
};

export default InviteRoomPage;

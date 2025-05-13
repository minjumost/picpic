import { useNavigate } from "react-router";
import { initStompSession } from "../sockets/stompClient";
import { connectAndEnterSession } from "../sockets/sessionSocket";
import { useSessionCode } from "../hooks/useSessionCode";

const InviteRoomPage: React.FC = () => {
  const navigate = useNavigate();

  const sessionCode = useSessionCode();

  const roomUrl = `https://localhost:5173/roomPwd?r=${sessionCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl).then(() => {
      alert("링크가 복사되었습니다!");
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
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">방 생성이 완료되었어요</h2>

      <p className="text-body1 font-bold text-gray-500 mb-6">
        링크를 공유하고 친구와 함께 찍어볼까요?
      </p>

      <div className="w-full mb-6 text-left">
        <p className="text-body1 text-gray-400 mb-1">링크 눌러서 복사</p>
        <div
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 truncate cursor-pointer"
          onClick={handleCopy}
        >
          {roomUrl}
        </div>
      </div>

      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={handleEnterRoom}
      >
        입장하기
      </button>
    </div>
  );
};

export default InviteRoomPage;

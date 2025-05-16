import { useNavigate } from "react-router";
import { initStompSession } from "../sockets/stompClient";
import { connectAndEnterSession } from "../sockets/sessionSocket";
import { useSessionCode } from "../hooks/useSessionCode";

const InviteRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const sessionCode = useSessionCode();

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
    <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-8">
      {/* 제목 */}
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-[24px] font-bold text-gray-800">
          방 생성이 완료됐어요🥳
        </h2>
      </div>

      <button
        className="py-3 items-center rounded-lg font-semibold text-lg w-[350px] bg-main1 text-white px-6 cursor-pointer"
        onClick={handleEnterRoom}
      >
        입장하기
      </button>
    </div>
  );
};

export default InviteRoomPage;

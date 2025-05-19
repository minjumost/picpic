import Lottie from "lottie-react";
import { useNavigate } from "react-router";
import completeAnimation from "../assets/Animation.json";
import Button from "../components/Button";
import MainLayout from "../components/Layouts/MainLayout";
import { useSessionCode } from "../hooks/useSessionCode";
import { connectAndEnterSession } from "../sockets/sessionSocket";
import { initStompSession } from "../sockets/stompClient";

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
      navigate(`/waiting?r=${sessionCode}`, { replace: true });
    } catch (error) {
      alert("방 입장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <MainLayout footer={<Button label="입장하기" onClick={handleEnterRoom} />}>
      <div className="flex h-full flex-col justify-center items-center gap-2 mb-32">
        <Lottie
          animationData={completeAnimation}
          loop={false}
          className="w-48"
        />
        <h2 className="text-[22px] font-bold text-gray-800">
          방 생성이 완료됐어요
        </h2>
        <p className="text-[16px] font-medium text-gray-600">
          입장하고 친구들을 초대해보세요
        </p>
      </div>
    </MainLayout>
  );
};

export default InviteRoomPage;

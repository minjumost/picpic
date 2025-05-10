import { useNavigate } from "react-router-dom";
import PuppyImg from "../assets/puppy.png";
import { sendEvent } from "../utils/analytics";
import GA4Initializer from "../GA4Initializer";
import { useMutation } from "@tanstack/react-query";
import { getRoomCode } from "../api/room";

const LandingPage = () => {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: getRoomCode,
    onSuccess: (roomCode) => {
      sendEvent("LandingPage", "StartButtonClick");
      navigate(`/main?r=${roomCode.code}`);
    },
  });

  const handleStart = () => {
    sendEvent("LandingPage", "StartButtonClick");
    mutate();
  };

  return (
    <>
      <GA4Initializer />
      <div className="bg-bg h-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center">
          <div>친구들과 꾸미는 공간</div>
          <div className="text-title">미니피아</div>
        </div>
        <div className="w-30">
          <img src={PuppyImg} alt="귀여운 강아지" />
        </div>
        <div className="w-[256px] h-[64px] flex justify-center items-center bg-red border-[2px] border-text rounded-xl cursor-pointer">
          <div
            className="text-[40px] text-white tracking-[-0.011em]"
            onClick={handleStart}
          >
            START
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

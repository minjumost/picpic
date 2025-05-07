import { useNavigate } from "react-router-dom";
import PuppyImg from "../assets/puppy.png";
import { sendEvent } from "../utils/analytics";
import GA4Initializer from "../GA4Initializer";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    sendEvent("LandingPage", "StartButtonClick");
    navigate(`/main?r=${import.meta.env.VITE_ROOM_CODE}`);
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

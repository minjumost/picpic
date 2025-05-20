import React from "react";
import { useNavigate } from "react-router";
import FourFrame from "../components/Layouts/FourFrame";
import MainLayout from "../components/Layouts/MainLayout";
import SixFrame from "../components/Layouts/SixFrame";
import { usePageExitEvent } from "../hooks/usePageExitEvent";
import { useFrameStore } from "../store/store";

const fourFrameId = 1;
const sixFrameId = 2;

const SelectFrameScreen: React.FC = () => {
  usePageExitEvent("SelectFramePage");
  const navigate = useNavigate();

  const setSelectedFrame = useFrameStore((state) => state.setSelectedFrame);

  return (
    <MainLayout
      title="프레임을 선택해주세요"
      description={["추후에 프레임을 추가할게요"]}
    >
      <div className="flex w-full gap-2">
        <div className="flex flex-row gap-5 w-full h-[500px]">
          <div
            className="w-1/2 h-[300px] relative cursor-pointer"
            onClick={() => {
              setSelectedFrame("four");
              navigate(`/roomSet?f=${fourFrameId}`, { replace: true });
            }}
          >
            <FourFrame photos={[]} />
          </div>
          <div
            className="w-1/2 h-[300px] relative cursor-pointer"
            onClick={() => {
              setSelectedFrame("six");
              navigate(`/roomSet?f=${sixFrameId}`, { replace: true });
            }}
          >
            <SixFrame photos={[]} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SelectFrameScreen;

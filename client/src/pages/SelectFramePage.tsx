import React from "react";
import { useNavigate } from "react-router";
import { useGetFrames } from "../api/frame";
import MainLayout from "../components/Layouts/MainLayout";
import type { FramePhoto } from "../components/Layouts/FourFrame";
import FourFrame from "../components/Layouts/FourFrame";
import SixFrame from "../components/Layouts/SixFrame";
import { useFrameStore } from "../store/store";
import { usePageExitEvent } from "../hooks/usePageExitEvent";

const fourFrameId = 1;
const sixFrameId = 2;

const fourFrame: FramePhoto[] = [
  {
    slotIndex: 0,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 1,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 2,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 3,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
];

const sixFrame: FramePhoto[] = [
  {
    slotIndex: 0,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 1,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 2,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 3,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 4,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
  {
    slotIndex: 5,
    photoImageUrl: "../src/assets/frames/none.jpg",
  },
];

const SelectFrameScreen: React.FC = () => {
  usePageExitEvent("SelectFramePage");
  const navigate = useNavigate();
  const { data } = useGetFrames();
  const setSelectedFrame = useFrameStore((state) => state.setSelectedFrame);

  console.log(data);

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
            <FourFrame photos={fourFrame} />
          </div>
          <div
            className="w-1/2 h-[300px] relative cursor-pointer"
            onClick={() => {
              setSelectedFrame("six");
              navigate(`/roomSet?f=${sixFrameId}`, { replace: true });
            }}
          >
            <SixFrame photos={sixFrame} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SelectFrameScreen;

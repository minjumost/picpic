import React from "react";
import { useNavigate } from "react-router";
import { useGetFrames, type FrameResponse } from "../api/frame";
import MainLayout from "../components/Layouts/MainLayout";

interface FrameOptionProps {
  name: string;
  image: string;
  onClick: () => void;
}

const FrameOption: React.FC<FrameOptionProps> = ({ name, image, onClick }) => (
  <div
    onClick={onClick}
    className="
      flex flex-col items-center cursor-pointer p-3 border gap-6 bg-black/10 border-gray-300 rounded-lg 
      flex-1 min-w-[90px]
      hover:bg-secondary1
      active:scale-98 transition-transform duration-100 ease-in-out
    "
  >
    <div className="h-full">
      <img src={image} />
    </div>
    <span className="bg-main1 text-text-white py-1 px-3 rounded-full">
      {name}
    </span>
  </div>
);

const SelectFrameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useGetFrames();

  console.log(data);

  return (
    <MainLayout
      title="프레임을 선택해주세요"
      description={["추후에 프레임을 추가할게요"]}
    >
      <div className="flex overflow-x-auto w-full justify-center gap-2">
        {data &&
          data.map((frame: FrameResponse) => (
            <FrameOption
              key={frame.frameId}
              name={frame.name}
              image={frame.frameImageUrl}
              onClick={() => {
                navigate(`/roomSet?f=${frame.frameId}`, { replace: true });
              }}
            />
          ))}
      </div>
    </MainLayout>
  );
};

export default SelectFrameScreen;

import React from "react";
import { useNavigate } from "react-router";
import { useGetFrames } from "../api/frame";
import frame1 from "../assets/frames/frame1.png";
import frame2 from "../assets/frames/frame2.png";

interface FrameOptionProps {
  name: string;
  image: string;
  onClick: () => void;
}

const FrameOption: React.FC<FrameOptionProps> = ({ name, image, onClick }) => (
  <div
    className="flex flex-col items-center cursor-pointer p-3 border gap-2 bg-black/20 border-gray-300 rounded-lg flex-1 min-w-[90px] hover:bg-secondary1 transition-colors"
    onClick={onClick}
  >
    <div>
      <img src={image} />
    </div>
    <span className="bg-main1 text-text-white py-1 px-3 rounded-full">
      {name}
    </span>
  </div>
);

const SelectFrameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetFrames();

  // TODO: 스피너 컴포넌트로 교체필요
  if (isLoading) return <div>로딩 중..</div>;

  console.log(data);

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2 text-gray-700">
        프레임을 선택해주세요.
      </h2>
      <p className="font-bold text-gray-500 mb-6">
        옆으로 넘기면 더 많은 프레임이 있어요.
      </p>

      <div className="flex space-x-3 overflow-x-auto pb-2 w-full justify-start md:justify-center">
        <FrameOption
          name="4 Cuts"
          image={frame1}
          onClick={() => {
            navigate("/roomSet");
          }}
        />
        <FrameOption
          name="4 Cuts"
          image={frame2}
          onClick={() => {
            navigate("/roomSet");
          }}
        />
      </div>
    </div>
  );
};

export default SelectFrameScreen;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useNavigate } from "react-router";
import { useGetFrames } from "../api/frame";

interface FrameOptionProps {
  name: string;
  gridClasses: string; // Tailwind grid 클래스
  slotCount: number;
  onClick: () => void;
}

const FrameOption: React.FC<FrameOptionProps> = ({
  name,
  gridClasses,
  slotCount,
  onClick,
}) => (
  <div
    className="flex flex-col items-center cursor-pointer p-3 border border-gray-300 rounded-lg bg-white flex-1 min-w-[90px] hover:border-orange-400 transition-colors"
    onClick={onClick}
  >
    {/* TODO 추후 이미지로 교체 */}
    <div
      className={`w-[70px] h-[90px] border-2 border-gray-400 bg-gray-100 mb-2 grid ${gridClasses}`}
    >
      {[...Array(slotCount)].map((_, i) => (
        <div key={i} className="border border-gray-300"></div>
      ))}
    </div>
    <span className="bg-main1 text-text-white py-1 px-3 rounded-full">
      {name}
    </span>
  </div>
);

const SelectFrameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetFrames();

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
          name="8 Cuts"
          gridClasses="grid-cols-2 grid-rows-4"
          slotCount={8}
          onClick={() => {
            alert("추후 개발 예정입니다!");
          }}
        />
        <FrameOption
          name="4 Cuts"
          gridClasses="grid-cols-1 grid-rows-4"
          slotCount={4}
          onClick={() => {
            alert("추후 개발 예정입니다!");
          }}
        />
        <FrameOption
          name="4 Cuts"
          gridClasses="grid-cols-2 grid-rows-2"
          slotCount={4}
          onClick={() => {
            navigate("/backImg");
          }}
        />
      </div>
    </div>
  );
};

export default SelectFrameScreen;

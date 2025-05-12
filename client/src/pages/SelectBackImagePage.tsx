import React from "react";
import { useNavigate } from "react-router";
import { useGetBackgrounds } from "../api/backImage";

interface BackImageOption {
  backgroundId: number;
  name: string;
  backgroundImageUrl: string;
  onClick: () => void;
}

const BackImageOption: React.FC<BackImageOption> = ({
  backgroundId,
  name,
  backgroundImageUrl,
  onClick,
}) => (
  <div
    key={backgroundId}
    className="flex flex-col items-center cursor-pointer p-3 border border-gray-300 rounded-lg bg-white flex-1 min-w-[90px] hover:border-orange-400 transition-colors"
    onClick={onClick}
  >
    <img className="w-[170px] h-[190px] mb-2" src={backgroundImageUrl} />

    <span className="bg-main1 text-text-white py-1 px-3 rounded-full">
      {name}
    </span>
  </div>
);

const SelectBackImagePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useGetBackgrounds();

  // TODO: 스피너 컴포넌트로 교체필요
  if (isLoading) return <div>로딩 중..</div>;

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2 text-gray-700">
        배경을 선택해주세요.
      </h2>
      <p className="font-bold text-gray-500 mb-6">
        옆으로 넘기면 더 많은 배경이 있어요.
      </p>

      <div className="flex space-x-3 overflow-x-auto pb-2 w-full justify-start md:justify-center">
        <BackImageOption
          backgroundId={1}
          name="배경1"
          backgroundImageUrl="https://buly.kr/1n3nusF"
          onClick={() => {
            navigate("/roomSet");
          }}
        />
        <BackImageOption
          backgroundId={2}
          name="배경2"
          backgroundImageUrl="https://buly.kr/1n3nusF"
          onClick={() => {
            navigate("/roomSet");
          }}
        />
      </div>
    </div>
  );
};

export default SelectBackImagePage;

import React from "react";
import { useNavigate } from "react-router";
import { useSessionCode } from "../hooks/useSessionCode";

const PhotoCapturePage: React.FC = () => {
  const navigate = useNavigate();

  const sessionCode = useSessionCode();

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">사진을 찍어주세요</h2>
      <p className="text-body1 font-bold text-gray-500 mb-6">
        원하는 칸에 들어가 사진을 찍을 수 있어요. 다시 찍기도 가능해요.
      </p>

      <div className="w-full h-full bg-gray-600 p-4 grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white w-full h-full rounded-sm shadow-inner cursor-pointer"
            onClick={() => {
              navigate(`/camera?r=${sessionCode}`);
            }}
          />
        ))}
      </div>
      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          navigate(`/guide?r=${sessionCode}`);
        }}
      >
        꾸미러 가기
      </button>
    </div>
  );
};

export default PhotoCapturePage;

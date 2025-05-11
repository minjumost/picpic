import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import { useGuestLogin } from "../api/auth";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const guestLoginMutation = useGuestLogin();

  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-16">
      <img src={logo} />
      <p className="text-gray-600 mb-8 text-sm">
        함께 찍고, 함께 남기는 우리만의 순간.
      </p>
      <div className="relative w-48 h-56 mb-10">
        {/* 포토스트립 이미지 대체 */}
        <div className="absolute w-28 h-40 bg-white border-2 border-gray-500 shadow-lg transform -rotate-12 top-4 left-2">
          <div className="grid grid-rows-2 h-full">
            <div className="border-b border-gray-400"></div>
            <div className=""></div>
          </div>
        </div>
        <div className="absolute w-28 h-40 bg-white border-2 border-gray-500 shadow-lg transform rotate-6 top-8 right-2">
          <div className="grid grid-rows-3 h-full">
            <div className="border-b border-gray-400"></div>
            <div className="border-b border-gray-400"></div>
            <div className=""></div>
          </div>
        </div>
      </div>
      <button
        className="w-full bg-main1 text-text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          guestLoginMutation.mutate(undefined, {
            onSuccess: (data) => {
              navigate("/frame");
              console.log("로그인 성공:", data);
            },
            onError: (error) => {
              console.error("에러 발생:", error);
            },
          });
        }}
      >
        시작하기
      </button>
    </div>
  );
};

export default LandingPage;

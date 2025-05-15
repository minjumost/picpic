import React from "react";
import logo from "../../assets/logo.png";
import LoginButtons from "./LoginButtons";

const LandingPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-16 gap-4">
      <img src={logo} className="w-28 h-24" />
      <p className="text-heading4 text-black mb-8 text-sm">
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
              sessionStorage.setItem("isOwner", "1");
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
      <LoginButtons />
    </div>
  );
};

export default LandingPage;

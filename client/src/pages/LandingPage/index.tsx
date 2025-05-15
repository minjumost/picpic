import React from "react";
import logo from "../../assets/logo.png";
import LoginButtons from "./LoginButtons";

const LandingPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-4 gap-8">
      {/* Logo */}
      <div className="flex flex-col gap-4 items-center">
        <img src={logo} className="w-32" />
        <p className="text-gray-500 font-semibold text-xl">
          함께 찍고, 함께 그리는 우리의 순간
        </p>
      </div>

      {/* 이미지 대체 */}
      <div className="relative w-full h-full bg-red-50">
        {/* <div className="absolute w-28 h-40 bg-white border-2 border-gray-500 shadow-lg transform -rotate-12 top-4 left-2">
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
        </div> */}
      </div>

      <LoginButtons />
    </div>
  );
};

export default LandingPage;

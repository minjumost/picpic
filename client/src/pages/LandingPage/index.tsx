import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import logo from "../../assets/logo.png";
import 소개1 from "../../assets/소개1.png";
import 소개2 from "../../assets/소개2.png";
import 소개3 from "../../assets/소개3.png";
import 소개4 from "../../assets/소개4.png";
import LoginButtons from "./LoginButtons";
import { usePageExitEvent } from "../../hooks/usePageExitEvent";

const LandingPage: React.FC = () => {
  usePageExitEvent("LandingPage");
  const images = [소개1, 소개2, 소개3, 소개4];

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-4 gap-8 ">
      {/* Logo */}
      <div className="flex flex-col gap-4 items-center">
        <img src={logo} className="w-32" />
        <p className="text-gray-500 font-semibold text-xl">
          함께 찍고, 함께 그리는 우리의 순간
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full max-w-[360px] mx-auto h-[350px] overflow-hidden">
        <Slider {...settings}>
          {images.map((image, idx) => (
            <div key={idx} className="flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-white overflow-hidden flex items-center justify-center transition-all duration-300">
                <img
                  src={image}
                  alt={`소개 ${idx + 1}`}
                  className="w-full h-[350px] object-contain"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <LoginButtons />
    </div>
  );
};

export default LandingPage;

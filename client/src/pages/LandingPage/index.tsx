import React from "react";
import logo from "../../assets/logo.png";
import 소개1 from "../../assets/소개1.png";
import 소개2 from "../../assets/소개2.png";
import 소개3 from "../../assets/소개3.png";
import 소개4 from "../../assets/소개4.png";
import LoginButtons from "./LoginButtons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPage: React.FC = () => {
  const images = [소개1, 소개2, 소개3, 소개4];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "60px",
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-4 gap-8">
      {/* Logo */}
      <div className="flex flex-col gap-4 items-center">
        <img src={logo} className="w-32" />
        <p className="text-gray-500 font-semibold text-xl">
          함께 찍고, 함께 그리는 우리의 순간
        </p>
      </div>

      {/* Carousel */}
      <div className="w-[400px] max-w-xl mx-auto h-[350px]">
        <Slider {...settings}>
          {images.map((image, idx) => (
            <div
              key={idx}
              className="h-[350px] flex items-center justify-center"
            >
              <div className="w-full h-full rounded-2xl shadow-xl bg-white overflow-hidden flex items-center justify-center transition-all duration-300">
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

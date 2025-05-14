import React, { useRef, useEffect, useState, useCallback } from "react";
import { type Image } from "../api/getImage";

const colors = [
  "#000000",
  "#FFFFFF",
  "#F2552C",
  "#FFD700",
  "#8BC34A",
  "#03A9F4",
  "#FFA500",
  "#A0522D",
  "#9C27B0",
];

const CanvasDrawOverImage: React.FC = () => {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#F2552C");
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentIndex, setCurrentIndex] = useState(0);

  // const sessionId = Number(sessionStorage.getItem("sessionId"));
  // const { data, isLoading } = useGetImages(sessionId);
  const imageList: Image[] = [
    { slotIndex: 1, photoImageUrl: "https://buly.kr/3YDNlg0" },
    { slotIndex: 2, photoImageUrl: "https://buly.kr/3YDNlg0" },
    // { slotIndex: 3, photoImageUrl: "https://buly.kr/3YDNlg0" },
  ];

  const currentImage = imageList[currentIndex];

  useEffect(() => {
    console.log(currentImage);
  }, [currentImage]);

  const handleNext = useCallback(() => {
    if (currentIndex >= imageList.length - 1) {
      console.log("📸 모든 이미지 완료");
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setTimeLeft(5); // 타이머 초기화

    const canvas = drawCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [currentIndex, imageList.length]);

  useEffect(() => {
    setTimeLeft(5); // 먼저 초기화
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log("⏰ 시간 종료");
          handleNext(); // 다음 이미지로
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // ✅ 정리해서 중복 타이머 방지
  }, [currentIndex, handleNext]);

  // 드로잉 캔버스 초기화
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
    }
  }, [currentImage?.photoImageUrl]);

  const getCtx = () => drawCanvasRef.current?.getContext("2d");

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    ctx.globalCompositeOperation =
      mode === "pen" ? "source-over" : "destination-out";
    ctx.strokeStyle = mode === "pen" ? color : "rgba(0,0,0,1)";
    ctx.lineWidth = mode === "pen" ? 6 : 20;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    const ctx = getCtx();
    if (ctx) ctx.globalCompositeOperation = "source-over";
  };

  // if (isLoading) return <div>로딩 중</div>;
  // const imageList: Image[] = data;

  return (
    <div className="flex flex-col justify-center w-full h-full p-8 gap-5">
      <div className="w-full flex justify-between">
        <h2 className="text-heading1 font-bold">사진을 꾸며주세요!</h2>
        <span className="text-heading1 text-danger font-bold">{timeLeft}s</span>
      </div>

      {/* 이미지 + 드로잉 캔버스를 겹쳐서 표시 */}
      <div className="relative w-full h-full">
        {currentImage ? (
          <img
            key={currentImage.slotIndex}
            src={currentImage.photoImageUrl}
            alt="base"
            onLoad={() =>
              console.log("🖼 이미지 로딩 완료", currentImage.photoImageUrl)
            }
            className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded border border-gray-300"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
            이미지 없음
          </div>
        )}
        <canvas
          ref={drawCanvasRef}
          className="absolute top-0 left-0 w-full h-full z-10"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <div className="flex gap-4 mb-2">
        <button
          className={`px-6 py-2 rounded font-bold ${
            mode === "pen" ? "bg-main1 text-white" : "bg-gray-100 text-black"
          }`}
          onClick={() => setMode("pen")}
        >
          펜
        </button>
        <button
          className={`px-6 py-2 rounded font-bold ${
            mode === "eraser" ? "bg-main1 text-white" : "bg-black text-white"
          }`}
          onClick={() => setMode("eraser")}
        >
          지우개
        </button>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {colors.map((c, idx) => (
          <div
            key={idx}
            onClick={() => setColor(c)}
            className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
              color === c ? "border-main1" : "border-gray-300"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-main1 text-white font-bold py-3 rounded-lg shadow-md mt-4 cursor-pointer"
      >
        {currentIndex >= imageList.length - 1 ? "완료" : "다음"}
      </button>
    </div>
  );
};

export default CanvasDrawOverImage;

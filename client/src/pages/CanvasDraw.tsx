import React, { useRef, useEffect, useState } from "react";

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

const CanvasDraw: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#F2552C");
  const [timeLeft, setTimeLeft] = useState(120);

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log("⏰ 시간 종료");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
    }
  }, []);

  const getContext = () => canvasRef.current?.getContext("2d");

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getContext();
    if (!ctx) return;
    isDrawing.current = true;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = getContext();
    if (!ctx) return;

    if (mode === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)"; // 색은 의미 없음
    }

    ctx.lineWidth = 6;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    const ctx = getContext();
    if (ctx) ctx.globalCompositeOperation = "source-over"; // 원래대로
  };

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <div className="w-full flex justify-between">
        <h2 className="text-heading1 font-bold">사진을 꾸며주세요!</h2>
        <span className="text-heading1 text-danger font-bold">{timeLeft}s</span>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full aspect-square bg-white border-2 border-gray-300 rounded"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

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
            className="w-12 h-12 rounded-full cursor-pointer border border-gray-300"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <button className="w-full bg-main1 text-white font-bold py-3 rounded-lg shadow-md mt-4">
        다음
      </button>
    </div>
  );
};

export default CanvasDraw;

import React, { useRef, useEffect, useState } from "react";
import { setHandlers } from "../sockets/stompClient";
import {
  sendCollageStart,
  sendDrawStroke,
  type DrawStrokePayload,
} from "../sockets/sessionSocket";
import { useSessionCode } from "../hooks/useSessionCode";
import { useGetCollageImage, usePostCollageLastImage } from "../api/CompImg";
import { useNavigate } from "react-router";
import { getCurrentDateTimeString } from "./CameraPage";
import { dataURLtoFile } from "../utils/dataURLtoFile";
import { getPresignedUrl } from "./CameraPage/useUploadImage";
import { uploadToS3 } from "../utils/uploadToS3";

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
  const [mode, setMode] = useState<"PEN" | "ERASER">("PEN");
  const [color, setColor] = useState("#F2552C");
  const [strokePoints, setStrokePoints] = useState<{ x: number; y: number }[]>(
    []
  );
  const sessionCode = useSessionCode();
  const navigate = useNavigate();
  const postImage = usePostCollageLastImage();

  const sessionId = Number(sessionStorage.getItem("sessionId"));
  const { data, isLoading } = useGetCollageImage(sessionId);

  // 드로잉 캔버스 초기화
  useEffect(() => {
    if (!data) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
    }
  }, [data]);

  const captureCanvas = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas || !data) return null;

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = drawCanvas.width;
    finalCanvas.height = drawCanvas.height;
    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return null;

    // 1. 배경 이미지 로드
    const image = new Image();
    image.crossOrigin = "anonymous"; // CORS 문제 방지
    image.src = data.collageImageUrl;

    return new Promise<string | null>((resolve) => {
      image.onload = () => {
        // 배경 그리기
        ctx.drawImage(image, 0, 0, finalCanvas.width, finalCanvas.height);
        // 드로잉 내용 합성
        ctx.drawImage(drawCanvas, 0, 0);

        // base64로 캡처
        const dataURL = finalCanvas.toDataURL("image/png");
        resolve(dataURL);
      };

      image.onerror = () => {
        console.error("이미지 로드 실패");
        resolve(null);
      };
    });
  };

  const handleComplete = async () => {
    console.log("완료");
    const captured = await captureCanvas();
    if (!captured) return;

    const fileName = `${getCurrentDateTimeString()}.png`;
    const file = dataURLtoFile(captured, fileName);

    const { presignedUrl, imageUrl } = await getPresignedUrl({
      type: "collage",
      fileName: file.name,
      contentType: file.type,
    });

    await uploadToS3(presignedUrl, file);

    try {
      await postImage.mutateAsync({
        sessionId: sessionId,
        collageImageUrl: imageUrl,
      });

      console.log("성공");
      sendCollageStart(sessionId, sessionCode);
      navigate(`/final?r=${sessionCode}`);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  useEffect(() => {
    setHandlers({
      stroke: (data: {
        type: string;
        color: string;
        lineWidth: number;
        points: { x: number; y: number }[];
        tool: string;
      }) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx || data.points.length < 2) return;

        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.globalCompositeOperation =
          data.tool === "ERASER" ? "destination-out" : "source-over";

        ctx.beginPath();
        ctx.moveTo(data.points[0].x, data.points[0].y);
        for (let i = 1; i < data.points.length; i++) {
          ctx.lineTo(data.points[i].x, data.points[i].y);
        }
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over"; // 되돌려놓기
      },
      collage_start: async () => {
        await handleComplete();
        navigate(`/final?r=${sessionCode}`);
      },
    });
  }, []);

  if (isLoading) return <div>로딩 중</div>;
  console.log(data);

  const getCtx = () => drawCanvasRef.current?.getContext("2d");

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    setStrokePoints([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.globalCompositeOperation =
      mode === "PEN" ? "source-over" : "destination-out";
    ctx.strokeStyle = mode === "PEN" ? color : "rgba(0,0,0,1)";
    ctx.lineWidth = mode === "PEN" ? 6 : 20;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.lineTo(x, y);
    ctx.stroke();

    setStrokePoints((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    const ctx = getCtx();
    if (ctx) ctx.globalCompositeOperation = "source-over";
    if (!ctx) return;

    const sessionId = Number(sessionStorage.getItem("sessionId"));
    const lineWidth = (ctx.lineWidth = mode === "PEN" ? 6 : 20);
    const payload: DrawStrokePayload = {
      sessionId: sessionId,
      sessionCode: sessionCode,
      color: color,
      lineWidth: lineWidth,
      points: strokePoints,
      tool: mode,
    };

    if (strokePoints.length > 1) {
      sendDrawStroke(payload);
    }
    setStrokePoints([]); // 초기화
  };

  return (
    <div className="flex flex-col w-full h-full p-8 gap-5 overflow-y-auto">
      {/* 제목 */}
      <div className="w-full flex justify-between">
        <h2 className="text-heading1 font-bold">사진을 꾸며주세요!</h2>
      </div>

      {/* 이미지 + 드로잉 캔버스를 겹쳐서 표시 */}
      <div className="relative w-full h-full flex-shrink-0">
        {data && (
          <img
            src={data.collageImageUrl}
            alt="base"
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              const rect = img.getBoundingClientRect();
              console.log("이미지 실제 크기:", {
                width: rect.width,
                height: rect.height,
              });

              // 캔버스 크기도 이미지 크기에 맞춤
              const canvas = drawCanvasRef.current;
              if (canvas) {
                canvas.width = rect.width;
                canvas.height = rect.height;
              }
            }}
            className="absolute top-0 left-0 w-full object-contain z-0 rounded border border-gray-300"
          />
        )}
        <canvas
          ref={drawCanvasRef}
          className="absolute top-0 left-0 w-full object-contain z-10"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {/* 그리기 툴 */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 mb-2">
          <button
            className={`px-6 py-2 rounded font-bold ${
              mode === "PEN" ? "bg-main1 text-white" : "bg-gray-100 text-black"
            }`}
            onClick={() => setMode("PEN")}
          >
            펜
          </button>
          <button
            className={`px-6 py-2 rounded font-bold ${
              mode === "ERASER" ? "bg-main1 text-white" : "bg-black text-white"
            }`}
            onClick={() => setMode("ERASER")}
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
      </div>

      <button
        onClick={handleComplete}
        className="w-full bg-main1 text-white font-bold py-3 rounded-lg shadow-md mt-4 cursor-pointer"
      >
        완료
      </button>
    </div>
  );
};

export default CanvasDrawOverImage;

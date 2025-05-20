import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  sendCollageStart,
  sendDrawStroke,
  type DrawStrokePayload,
} from "../sockets/sessionSocket";
import { setHandlers } from "../sockets/stompClient";
import { useSessionCode } from "../hooks/useSessionCode";
import { useGetCollageImage, usePostCollageLastImage } from "../api/CompImg";
import { getCurrentDateTimeString } from "./CameraPage";
import { dataURLtoFile } from "../utils/dataURLtoFile";
import { getPresignedUrl } from "./CameraPage/useUploadImage";
import { uploadToS3 } from "../utils/uploadToS3";
import { usePageExitEvent } from "../hooks/usePageExitEvent";
import { sendEvent } from "../utils/analytics";
import MainLayout from "../components/Layouts/MainLayout";
import Button from "../components/Button";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDrawing = useRef(false);
  const strokeQueue = useRef<DrawStrokePayload[]>([]);

  const sessionCode = useSessionCode();
  const navigate = useNavigate();
  const postImage = usePostCollageLastImage();
  const enterTimeRef = useRef<number>(Date.now());

  const sessionId = Number(sessionStorage.getItem("sessionId"));
  const { data, isLoading } = useGetCollageImage(sessionId);

  const location = useLocation();
  const { startTime, duration } = location.state as {
    startTime: string;
    duration: number;
  };

  const MAX_POINTS_PER_MESSAGE = 20;

  const [mode, setMode] = useState<"PEN" | "ERASER">("PEN");
  const [color, setColor] = useState("#F2552C");
  const [lineWidth, setLineWidth] = useState<number>(12);
  const [strokePoints, setStrokePoints] = useState<{ x: number; y: number }[]>(
    []
  );
  const [remainingTime, setRemainingTime] = useState<number>(0);

  usePageExitEvent("CanvasDraw");

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const end = start + duration * 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setRemainingTime(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, duration]);

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return;
    const img = imageRef.current;
    const canvas = canvasRef.current;

    const handleResize = () => {
      const parentHeight = canvas.parentElement?.clientHeight || 0;
      img.style.height = `${parentHeight}px`;
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.style.width = `${img.clientWidth}px`;
        canvas.style.height = `${img.clientHeight}px`;
      };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]);

  const flushStrokePoints = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return;

    for (let i = 0; i < points.length - 1; i += MAX_POINTS_PER_MESSAGE) {
      const chunk = points.slice(i, i + MAX_POINTS_PER_MESSAGE + 1);
      if (chunk.length < 2) continue;

      const payload: DrawStrokePayload = {
        sessionId,
        sessionCode,
        color,
        lineWidth,
        points: chunk,
        tool: mode,
      };

      sendDrawStroke(payload);
    }
  };

  const getOffset = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getOffset(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setStrokePoints([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getOffset(e);
    ctx.globalCompositeOperation =
      mode === "PEN" ? "source-over" : "destination-out";
    ctx.strokeStyle = mode === "PEN" ? color : "rgba(0,0,0,1)";
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    setStrokePoints((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || strokePoints.length < 2) return;
    ctx.globalCompositeOperation = "source-over";

    const payload: DrawStrokePayload = {
      sessionId,
      sessionCode,
      color,
      lineWidth,
      points: strokePoints,
      tool: mode,
    };

    flushStrokePoints(strokePoints); // <- 여기에 분할 전송

    setStrokePoints([]);

    while (strokeQueue.current.length > 0) {
      const p = strokeQueue.current.shift();
      if (p) drawFromServer(p);
    }
  };

  const getTouchOffset = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getTouchOffset(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setStrokePoints([{ x, y }]);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getTouchOffset(e);
    ctx.globalCompositeOperation =
      mode === "PEN" ? "source-over" : "destination-out";
    ctx.strokeStyle = mode === "PEN" ? color : "rgba(0,0,0,1)";
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    setStrokePoints((prev) => [...prev, { x, y }]);
  };

  const handleTouchEnd = () => {
    handleMouseUp(); // 로직 동일하므로 재사용
  };

  const drawFromServer = (data: DrawStrokePayload) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || data.points.length < 2) return;
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.lineWidth;
    ctx.globalCompositeOperation =
      data.tool === "ERASER" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(data.points[0].x, data.points[0].y);
    for (let i = 1; i < data.points.length; i++) {
      ctx.lineTo(data.points[i].x, data.points[i].y);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  };

  useEffect(() => {
    setHandlers({
      stroke: (data) => {
        if (isDrawing.current) {
          strokeQueue.current.push(data);
        } else {
          drawFromServer(data);
        }
      },
      collage_start: async () => {
        await handleComplete();
        navigate(`/final?r=${sessionCode}`, { replace: true });
      },
    });
  }, []);

  const handleComplete = async () => {
    const staySeconds = Math.floor((Date.now() - enterTimeRef.current) / 1000);
    sendEvent("CanvasDraw", "Complete", `${staySeconds}초 걸림`);
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const ctx = finalCanvas.getContext("2d");

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = data.collageImageUrl;

    await new Promise<void>((resolve) => {
      image.onload = () => {
        ctx?.drawImage(image, 0, 0, finalCanvas.width, finalCanvas.height);
        ctx?.drawImage(canvas, 0, 0);
        resolve();
      };
    });

    const file = dataURLtoFile(
      finalCanvas.toDataURL("image/png"),
      `${getCurrentDateTimeString()}.png`
    );

    const { presignedUrl, imageUrl } = await getPresignedUrl({
      type: "collage",
      fileName: file.name,
      contentType: file.type,
    });

    await uploadToS3(presignedUrl, file);
    await postImage.mutateAsync({ sessionId, collageImageUrl: imageUrl });
    sendCollageStart(sessionId, sessionCode);
  };

  if (isLoading) return <div>로딩 중</div>;

  return (
    <MainLayout
      title="사진을 꾸며주세요"
      description={[remainingTime + "초 남음"]}
      footer={<Button label="완료" onClick={handleComplete} />}
    >
      <div className="relative w-[380px] h-[calc(100vh-200px)] flex justify-center items-center bg-gray-100 overflow-auto">
        {data && (
          <>
            <img
              ref={imageRef}
              src={data.collageImageUrl}
              alt="base"
              className="absolute top-0 left-0 object-contain"
              style={{ maxHeight: "100%", height: "100%" }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 pointer-events-auto"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg font-bold ${
                mode === "PEN"
                  ? "bg-main1 text-white"
                  : "bg-gray-100 text-black"
              }`}
              onClick={() => setMode("PEN")}
            >
              펜
            </button>
            <button
              className={`px-4 rounded-lg font-bold ${
                mode === "ERASER"
                  ? "bg-main1 text-white"
                  : "bg-gray-100 text-black"
              }`}
              onClick={() => setMode("ERASER")}
            >
              지우개
            </button>
          </div>
          <div className="flex items-center gap-4">
            {[15, 30, 60, 120].map((w) => (
              <button
                key={w}
                onClick={() => setLineWidth(w)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                  lineWidth === w ? "border-main1" : "border-gray-300"
                }`}
              >
                <div
                  className="rounded-full bg-black max-w-9 max-h-9"
                  style={{ width: `${w / 3}px`, height: `${w / 3}px` }}
                />
              </button>
            ))}
          </div>
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
    </MainLayout>
  );
};

export default CanvasDrawOverImage;

import React, { useEffect, useRef, useState } from "react";
import Camera from "../assets/icons/camera.png";

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("카메라 접근 실패:", err);
      }
    };

    initCamera();

    return () => {
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
    }
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    // 스트림 다시 켜기
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // 이거 추가해주는 것도 중요함
      }
    } catch (err) {
      console.error("재촬영 시 카메라 재시작 실패:", err);
    }
  };

  const handleConfirm = () => {
    console.log("이미지 확정:", capturedImage);
    // 여기서 navigate하거나 부모로 전달 가능
  };

  return (
    <div className="h-screen bg-[#f9f8f4] flex flex-col items-center justify-start pt-20 px-6 text-center">
      <h2 className="text-xl font-bold mb-8">사진을 찍어주세요</h2>

      <div className="w-[320px] h-[320px] bg-black mb-6 rounded-md overflow-hidden">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="캡처된 이미지"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {capturedImage ? (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleRetake}
            className="px-6 py-3 rounded-lg bg-gray-400 text-white font-semibold shadow"
          >
            재촬영
          </button>
          {/* TODO 확인 클릭 시 서버에 이미지 업로드 요청 기능 구현 */}
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-lg bg-[#f2552c] text-white font-semibold shadow"
          >
            확인
          </button>
        </div>
      ) : (
        <button
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
          onClick={handleCapture}
        >
          <img src={Camera} alt="촬영" className="w-8 h-8" />
        </button>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraPage;

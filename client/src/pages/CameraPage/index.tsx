import React, { useCallback, useEffect, useRef, useState } from "react";
import Camera from "../../assets/icons/camera.png";
import { useNavigate, useLocation } from "react-router";
import { getPresignedUrl, uploadToS3 } from "./useUploadImage";
import { useSessionCode } from "../../hooks/useSessionCode";
import { sendPhotoUpload } from "../../sockets/sessionSocket";
import { usePageExitEvent } from "../../hooks/usePageExitEvent";
// 날짜+시간 파일명 생성 함수
export function getCurrentDateTimeString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}_${mm}_${dd}_${hh}_${min}_${ss}`;
}

const CameraPage: React.FC = () => {
  usePageExitEvent("CameraPage");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showVideo, setShowVideo] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const slotIndex = Number(params.get("slot"));

  const sessionCode = useSessionCode();
  const sessionId = Number(sessionStorage.getItem("sessionId"));

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        setShowVideo(false);
      }
    }
    streamRef.current = null;
  }, []);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("카메라 접근 실패:", err);
      }
    };

    initCamera();

    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // canvas -> file 변환 함수
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const startCountdown = () => {
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          if (prev === 1) {
            handleCapture();
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

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
      const fileName = `${getCurrentDateTimeString()}.png`;
      const file = dataURLtoFile(imageData, fileName);
      setFile(file);
    }
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    setFile(null);
    startCountdown();
    // 스트림 다시 켜기
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("재촬영 시 카메라 재시작 실패:", err);
    }
  };

  // 업로드 및 WebSocket 전송 예시
  const handleConfirm = async () => {
    if (!file) return;
    setUploading(true);
    stopStream();
    await new Promise((r) => setTimeout(r, 100));
    try {
      // 1. presigned-url 요청
      const { presignedUrl, imageUrl } = await getPresignedUrl({
        type: "photo",
        fileName: file.name,
        contentType: file.type,
      });

      // 2. S3 업로드
      await uploadToS3(presignedUrl, file);
      // 3. WebSocket 메시지 전송 (예시, 실제 구현 필요)
      sendPhotoUpload(sessionId, sessionCode, slotIndex, imageUrl);
      // 4. 화면 이동 등
      navigate(`/photo?r=${sessionCode}`, { replace: true });
    } catch (err) {
      alert("업로드 실패");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-center justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">사진을 찍어주세요</h2>

      <div className="flex justify-center items-center w-full">
        <div className="w-full max-w-full h-[450px] mx-auto bg-black mb-6 rounded-md overflow-hidden flex items-center justify-center relative">
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-white text-8xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {countdown}
              </span>
            </div>
          )}
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="캡처된 이미지"
              className="w-full h-full object-cover -scale-x-100"
            />
          ) : (
            <>
              {showVideo && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover -scale-x-100"
                  autoPlay
                  playsInline
                  muted
                />
              )}
            </>
          )}
        </div>
      </div>

      {capturedImage ? (
        <div className="flex gap-4 mt-4 mx-auto">
          <button
            onClick={handleRetake}
            className="px-6 py-3 rounded-lg bg-gray-400 text-white font-semibold shadow"
            disabled={uploading || countdown !== null}
          >
            재촬영
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-lg bg-[#f2552c] text-white font-semibold shadow"
            disabled={uploading || countdown !== null}
          >
            {uploading ? "업로드 중..." : "확인"}
          </button>
        </div>
      ) : (
        <button
          className="w-16 h-16 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center"
          onClick={startCountdown}
          disabled={countdown !== null}
        >
          <img src={Camera} alt="촬영" className="w-8 h-8" />
        </button>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraPage;

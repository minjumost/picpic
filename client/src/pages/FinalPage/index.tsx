import { useEffect, useState } from "react";
import { useGetFinalImages } from "../../api/finalImages";
import { usePageExitEvent } from "../../hooks/usePageExitEvent";
import stompClient from "../../sockets/stompClient";

const FinalPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [delayPassed, setDelayPassed] = useState(false);
  const sessionId = Number(sessionStorage.getItem("sessionId"));

  const { data: images, isLoading, isError } = useGetFinalImages(sessionId);
  usePageExitEvent("FinalPage");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayPassed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (delayPassed && !isLoading) {
      setStep(2);
    }
  }, [delayPassed, isLoading]);

  if (step === 1) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-xl font-bold">사진 촬영이 끝났어요 🥳</p>
          <p className="text-sm text-gray-500 mt-2">
            완성된 사진을 만드는 중이에요
          </p>
          <div className="flex space-x-2 mt-6">
            <div className="w-2 h-2 bg-main1 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-main1/80 rounded-full animate-bounce [animation-delay:-0.10s]" />
            <div className="w-2 h-2 bg-main1/60 rounded-full animate-bounce" />
          </div>
        </div>
      </>
    );
  }

  if (isError || !images) {
    return <div className="text-center mt-20">에러가 발생했어요 😢</div>;
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(images.collageImageUrl, {
        mode: "cors", // CORS 허용 시 필요
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `collage_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-xl font-bold">사진이 완성되었어요 🥳</p>
      <img src={images.collageImageUrl} alt="collage" />

      <div className="flex gap-4">
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={handleDownload}
        >
          다운로드
        </button>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => {
            sessionStorage.clear();
            stompClient.deactivate();
            window.location.href = "/";
          }}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default FinalPage;

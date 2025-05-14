import { useEffect, useState } from "react";
import { useGetFinalImages } from "../../api/finalImages";
import { useNavigate } from "react-router";
import CompositeImage from "./CompositeImage";

// const images = [
//   {
//     slot_index: 0,
//     edited_image_url:
//       "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
//   },
//   {
//     slot_index: 1,
//     edited_image_url:
//       "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
//   },
//   {
//     slot_index: 2,
//     edited_image_url:
//       "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
//   },
//   {
//     slot_index: 3,
//     edited_image_url:
//       "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
//   },
// ];

const FinalPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [delayPassed, setDelayPassed] = useState(false);
  const navigate = useNavigate();
  const sessionId = Number(sessionStorage.getItem("sessionId"));

  const { data: images, isLoading, isError } = useGetFinalImages(sessionId);

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

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-xl font-bold">사진이 완성되었어요 🥳</p>
      <div className="w-[720px] h-[590px]">
        {images && <CompositeImage images={images} />}
      </div>

      <div className="flex gap-4">
        <a
          // href={images[0]?.edited_image_url}
          download
          className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          다운로드
        </a>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => navigate("/")}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default FinalPage;

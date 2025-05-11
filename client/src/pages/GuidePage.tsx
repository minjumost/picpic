import { useNavigate } from "react-router";

const GuidePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">이제 사진을 꾸며볼까요?</h2>

      <p className="text-heading3 font-bold text-gray-500 mb-6">
        🎨 한 컷씩 같이 꾸밀 수 있어요.
      </p>

      <p className="text-heading3 font-bold text-gray-500 mb-6">
        ⏰ 2분 안에 꾸미기를 완료해주세요.
      </p>

      <p className="text-heading3 font-bold text-gray-500 mb-6">
        ❌ 되돌릴 수 없으니 신중하게 꾸며주세요.
      </p>

      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          navigate("/decorate");
        }}
      >
        꾸미러 가기
      </button>
    </div>
  );
};

export default GuidePage;

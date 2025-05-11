import { useNavigate } from "react-router";

const InviteRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const roomUrl = "https://localhost:5173/waiting";

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl).then(() => {
      alert("링크가 복사되었습니다!");
    });
  };

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">방 생성이 완료되었어요</h2>

      <p className="text-body1 font-bold text-gray-500 mb-6">
        링크를 공유하고 친구와 함께 찍어볼까요?
      </p>

      <div className="w-full mb-6 text-left">
        <p className="text-body1 text-gray-400 mb-1">링크 눌러서 복사</p>
        <div
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 truncate cursor-pointer"
          onClick={handleCopy}
        >
          {roomUrl}
        </div>
      </div>

      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          navigate("/waiting");
        }}
      >
        입장하기
      </button>
    </div>
  );
};

export default InviteRoomPage;

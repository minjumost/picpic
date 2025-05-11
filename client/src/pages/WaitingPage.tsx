import { useNavigate } from "react-router";
interface User {
  name: string;
  isLeader?: boolean;
}

const WaitingPage: React.FC = () => {
  const navigate = useNavigate();

  const users: User[] = [
    { name: "즐거운 사자", isLeader: true },
    { name: "즐거운 사자" },
    { name: "즐거운 사자" },
  ];

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">
        친구들을 기다리고 있어요..
      </h2>

      <p className="text-body1 font-bold text-gray-500 mb-6">
        다 모이지 않아도 시작할 수 있어요
      </p>

      <div className="flex flex-col gap-3 w-full z-10 mb-6">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
          >
            <img
              src="/emoji.png" // 사용자 이모지 (예시)
              alt="user"
              className="w-6 h-6 mr-2"
            />
            <span className="text-sm font-medium">{user.name}</span>
            {user.isLeader && (
              <img
                src="/crown.png" // 왕관 아이콘
                alt="방장"
                className="w-4 h-4 ml-2"
              />
            )}
          </div>
        ))}
      </div>

      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          navigate("/photo");
        }}
      >
        시작하기
      </button>
    </div>
  );
};

export default WaitingPage;

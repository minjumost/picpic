import React from "react";
import { useNavigate } from "react-router";
import { useGuestLogin } from "../../api/auth";

interface ButtonProps {
  text: string;
  bgColor: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, bgColor, onClick }) => {
  return (
    <button
      className={`w-full ${bgColor} text-text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const LoginButtons: React.FC = () => {
  const navigate = useNavigate();
  const guestLoginMutation = useGuestLogin();

  const handleLogin = () => {
    guestLoginMutation.mutate(undefined, {
      onSuccess: (data) => {
        navigate("/frame");
        sessionStorage.setItem("isOwner", "1");
        sessionStorage.setItem("memberId", `${data.memberId}`);
        console.log("로그인 성공:", data);
      },
      onError: (error) => {
        console.error("에러 발생:", error);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* <Button text="SSAFY 로그인" bgColor="bg-main2" onClick={handleLogin} />
      <Button text="카카오톡 로그인" bgColor="bg-kakao" onClick={handleLogin} /> */}
      <Button text="빠른 시작하기" bgColor="bg-main1" onClick={handleLogin} />
    </div>
  );
};

export default LoginButtons;

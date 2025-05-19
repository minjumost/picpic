import React from "react";
import { useNavigate } from "react-router";
import { useGuestLogin } from "../../api/auth";
import Button from "../../components/Button";

const LoginButtons: React.FC = () => {
  const navigate = useNavigate();
  const guestLoginMutation = useGuestLogin();

  const handleLogin = () => {
    guestLoginMutation.mutate(undefined, {
      onSuccess: (data) => {
        navigate("/frame", { replace: true });
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
    <div className="w-full flex flex-col gap-4">
      <Button
        label="카카오 로그인"
        onClick={handleLogin}
        className="!bg-kakao !text-black"
      />
      <Button label="SSAFY 로그인" onClick={handleLogin} className="bg-main2" />
      <Button label="게스트 로그인" onClick={handleLogin} />
    </div>
  );
};

export default LoginButtons;

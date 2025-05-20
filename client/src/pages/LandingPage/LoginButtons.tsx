import React from "react";
import { useNavigate } from "react-router";
import { useGuestLogin } from "../../api/auth";
import Button from "../../components/Button";
import { sendEvent } from "../../utils/analytics";

const LoginButtons: React.FC = () => {
  const navigate = useNavigate();
  const guestLoginMutation = useGuestLogin();

  // 게스트 로그인
  const handleLogin = () => {
    sendEvent("Login", "Click", "Guest");
    guestLoginMutation.mutate(undefined, {
      onSuccess: (data) => {
        navigate("/frame", { replace: true });
        sessionStorage.setItem("isOwner", "1");
        sessionStorage.setItem("memberId", `${data.memberId}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError: (_error) => {},
    });
  };

  // // 카카오 로그인 (추후 구현)
  // const handleKakaoLogin = () => {
  //   sendEvent("Login", "Click", "Kakao");
  //   // 카카오 로그인 로직 추가 예정
  //   alert("카카오 로그인은 추후 지원됩니다.");
  // };

  // // SSAFY 로그인 (추후 구현)
  // const handleSSAFYLogin = () => {
  //   sendEvent("Login", "Click", "SSAFY");
  //   // SSAFY 로그인 로직 추가 예정
  //   alert("SSAFY 로그인은 추후 지원됩니다.");
  // };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* <Button
        label="카카오 로그인"
        onClick={handleKakaoLogin}
        className="!bg-kakao !text-black"
      />
      <Button label="SSAFY 로그인" onClick={handleLogin} className="bg-main2" /> */}
      <Button label="게스트 로그인" onClick={handleLogin} />
    </div>
  );
};

export default LoginButtons;

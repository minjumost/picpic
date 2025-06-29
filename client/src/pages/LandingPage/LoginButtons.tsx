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

  const handleSSAFYLogin = () => {
    sendEvent("Login", "Click", "SSAFY");
    const ssafyLoginUrl = `https://project.ssafy.com/oauth/sso-check?client_id=${
      import.meta.env.VITE_SSAFY_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_SSAFY_BACKEND_URL
    }&response_type=code`;
    window.location.href = ssafyLoginUrl;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        label="SSAFY 로그인"
        onClick={handleSSAFYLogin}
        className="bg-main2"
      />
      <Button label="게스트 로그인" onClick={handleLogin} />
    </div>
  );
};

export default LoginButtons;

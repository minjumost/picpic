import { useEffect } from "react";
import { initGA, sendPageView } from "./utils/analytics";
import { useLocation } from "react-router-dom";

export default function GA4Initializer() {
  const location = useLocation();

  // 앱 시작 시 1번만 GA 초기화
  useEffect(() => {
    initGA();
  }, []);

  // 라우팅 경로 변경될 때마다 페이지뷰 전송
  useEffect(() => {
    sendPageView();
  }, [location]);

  return null; // 렌더링은 하지 않음
}

import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-2RH22EZ8NY"; // ← 당신의 측정 ID로 바꾸세요

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

// URL 파라미터를 포함한 페이지뷰 전송
export const sendPageView = () => {
  const currentPath = window.location.pathname + window.location.search;
  ReactGA.send({ hitType: "pageview", page: currentPath });
};

export const sendEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({ category, action, label });
};

// 방 입장 이벤트
export const trackRoomEnter = (roomCode: string) => {
  const timestamp = new Date().toISOString();
  sendEvent(
    "Room",
    "Enter",
    JSON.stringify({
      roomCode,
      timestamp,
      path: window.location.pathname + window.location.search,
    })
  );
};

// 방 퇴장 이벤트
export const trackRoomExit = (roomCode: string) => {
  const timestamp = new Date().toISOString();
  sendEvent(
    "Room",
    "Exit",
    JSON.stringify({
      roomCode,
      timestamp,
      path: window.location.pathname + window.location.search,
    })
  );
};

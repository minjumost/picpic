import stompClient from "./stompClient";

export const connectAndEnterSession = (
  sessionCode: string,
  password: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    stompClient.onConnect = () => {
      console.log("✅ WebSocket connected");

      stompClient.publish({
        destination: "/send/session/enter",
        body: JSON.stringify({ sessionCode, password }),
      });

      resolve();
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP Error:", frame);
      reject(frame);
    };
    stompClient.activate();
  });
};

export const sendSessionStart = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    console.warn("❌ stompClient가 아직 연결되지 않았습니다.");
    return;
  }

  stompClient.publish({
    destination: "/send/session/start",
    body: JSON.stringify({ sessionId, sessionCode }),
  });

  console.log("📨 세션 시작 요청 전송 완료");
};

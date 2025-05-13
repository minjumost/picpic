import stompClient from "./stompClient";

export const connectAndEnterSession = (
  sessionCode: string,
  sessionId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    stompClient.onConnect = () => {
      console.log("✅ WebSocket connected");

      stompClient.publish({
        destination: "/send/session/start",
        body: JSON.stringify({ sessionCode, sessionId }),
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

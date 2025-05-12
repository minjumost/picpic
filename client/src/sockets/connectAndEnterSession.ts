import { initStompClient } from "./stompClient";

export const connectAndEnterSession = (
  sessionCode: string,
  sessionId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const client = initStompClient();

    client.onConnect = () => {
      console.log("✅ WebSocket connected");

      client.publish({
        destination: "/send/session/start",
        body: JSON.stringify({ sessionCode, sessionId }),
      });

      resolve();
    };

    client.onStompError = (frame) => {
      console.error("STOMP Error:", frame);
      reject(frame);
    };

    client.activate();
  });
};

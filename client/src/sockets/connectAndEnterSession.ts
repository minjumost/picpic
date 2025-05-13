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

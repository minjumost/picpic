import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { type IMessage } from "@stomp/stompjs";
import { useStompStatusStore } from "./useStompStore";

type HandlerMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (data: any) => void;
};

let handlers: HandlerMap = {};

export const setHandlers = (newHandlers: HandlerMap) => {
  handlers = { ...handlers, ...newHandlers };
  console.log("✅ [setHandlers] 등록됨:", Object.keys(handlers));
};

const stompClient = new Client({
  webSocketFactory: () =>
    new SockJS(`${import.meta.env.VITE_BASE_URL}/connection`),
  connectHeaders: {},
  debug: (str) => console.log("[STOMP DEBUG]:", str),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

export const initStompSession = (sessionCode: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { isConnected, setConnected } = useStompStatusStore.getState();

    if (isConnected) {
      console.log("🟡 이미 연결됨");
      resolve();
      return;
    }

    setConnected(true);

    stompClient.onConnect = () => {
      console.log("✅ STOMP 연결 완료");

      stompClient.subscribe(
        `/broadcast/${sessionCode}`,
        (message: IMessage) => {
          try {
            const parsed = JSON.parse(message.body);
            const { type } = parsed;

            console.log("💌 받은 메시지 type:", type);
            console.log("📦 현재 handlers:", Object.keys(handlers));

            const handler = handlers[type];
            if (handler) {
              handler(parsed);
            } else {
              console.warn("👻 No handler for type:", type);
            }
          } catch (e) {
            console.error("❌ Failed to parse STOMP message:", e);
          }
        }
      );

      stompClient.subscribe("/user/private", (message: IMessage) => {
        console.log("📨 [개인 메시지 수신]", message.body);
      });

      resolve();
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame);
      reject(frame);
    };

    stompClient.activate();
  });
};

export default stompClient;

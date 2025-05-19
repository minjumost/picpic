// stompClient

import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useStompStatusStore } from "./useStompStore";

type HandlerMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (data: any) => void;
};

let handlers: HandlerMap = {};

export const setHandlers = (newHandlers: HandlerMap) => {
  handlers = { ...handlers, ...newHandlers };
};

const stompClient = new Client({
  webSocketFactory: () =>
    new SockJS(`${import.meta.env.VITE_BASE_URL}/connection`),
  connectHeaders: {},
  debug: (str) => console.log("[STOMP DEBUG]:", str),
  reconnectDelay: 5000,
  heartbeatIncoming: 30000,
  heartbeatOutgoing: 30000,
});

export const initStompSession = (sessionCode: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { isConnected, setConnected } = useStompStatusStore.getState();
    if (isConnected) {
      console.log("🟡 이미 연결됨");
      resolve();
      return;
    }

    stompClient.onConnect = () => {
      setConnected(true);

      stompClient.subscribe(
        `/broadcast/${sessionCode}`,
        (message: IMessage) => {
          console.log(message.body);
          try {
            const parsed = JSON.parse(message.body);
            const { type } = parsed;

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

      stompClient.subscribe("/user/private", (message: IMessage) =>
        console.log(message)
      );

      resolve();
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP Error:", frame);
      reject(frame);
    };
    stompClient.activate();
  });
};

export default stompClient;

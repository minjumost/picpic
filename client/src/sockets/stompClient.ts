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
  reconnectDelay: 5000,
  heartbeatIncoming: 30000,
  heartbeatOutgoing: 30000,
});

export const initStompSession = (sessionCode: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { isConnected, setConnected } = useStompStatusStore.getState();
    if (isConnected) {
      resolve();
      return;
    }

    stompClient.onConnect = () => {
      setConnected(true);

      stompClient.subscribe(
        `/broadcast/${sessionCode}`,
        (message: IMessage) => {
          try {
            const parsed = JSON.parse(message.body);
            const { type } = parsed;

            const handler = handlers[type];
            if (handler) {
              handler(parsed);
            }
          } catch {
            /* empty */
          }
        }
      );

      stompClient.subscribe("/user/private/error", (msg: IMessage) => {
        const parsed = JSON.parse(msg.body);
        const { type, message } = parsed;
        if (type === "4006") {
          alert(message);
          window.location.replace("/");
        } else if (type === "4008") {
          alert(message);
        }
      });

      resolve();
    };

    stompClient.onStompError = (frame) => {
      reject(frame);
    };

    stompClient.onWebSocketClose = (event) => {
      if (!event.wasClean) {
        setConnected(false);
        alert("서버와의 연결이 끊겼습니다.");
        window.location.href = "/";
      }
    };

    stompClient.deactivate();

    stompClient.activate();
  });
};

export default stompClient;

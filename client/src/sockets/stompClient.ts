// stompClient

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { type IMessage } from "@stomp/stompjs";

type HandlerMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (data: any) => void;
};

let handlers: HandlerMap = {};

export const setHandlers = (newHandlers: HandlerMap) => {
  handlers = newHandlers;
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

let subscribed = false;

export const initStompSession = (sessionCode: string) => {
  const client = stompClient;
  if (subscribed) return;
  subscribed = true;

  client.activate();

  client.onConnect = () => {
    client.subscribe(`/broadcast/${sessionCode}`, (message: IMessage) => {
      console.log(message);
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
    });
    client.subscribe("/user/private", (message: IMessage) =>
      console.log(message)
    );
  };
};

export default stompClient;

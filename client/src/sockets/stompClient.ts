import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export let stompClient: Client | null = null;

export const initStompClient = () => {
  const socket = new SockJS(`${import.meta.env.VITE_BASE_URL}/wss`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log("[STOMP]", str),
    reconnectDelay: 5000,
  });
  return stompClient;
};

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const stompClient = new Client({
  webSocketFactory: () =>
    new SockJS(`${import.meta.env.VITE_BASE_URL}/connection`),
  connectHeaders: {},
  debug: (str) => console.log("[STOMP DEBUG]:", str),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

export default stompClient;

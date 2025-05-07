import { useEffect, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { StompMessage } from "../types/stomp";

export const useStomp = (
  roomCode: string | null,
  onMessage: (msg: StompMessage) => void
) => {
  const [client, setClient] = useState<Client | null>(null);
  // const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    const socket = new SockJS(`${import.meta.env.VITE_BASE_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      debug: (str) => console.log("[STOMP DEBUG]:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      setClient(stompClient);
      stompClient.subscribe(`/topic/room/${roomCode}`, (message: IMessage) => {
        try {
          const body = JSON.parse(message.body);
          if (body.type === "INIT") {
            console.log("[ROOM INIT]", body.data);
          } else {
            onMessage(body);
          }
        } catch (err) {
          console.error("[STOMP PARSE ERROR]", err);
        }
      });

      stompClient.subscribe("/user/queue/error", (message: IMessage) => {
        console.log(message);
      });

      stompClient.publish({
        destination: "/app/room/enter",
        body: JSON.stringify({ code: roomCode }),
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("[STOMP ERROR]", frame.headers["message"]);
      setClient(null);
      onerror?.(frame.headers["message"]);
    };

    stompClient.activate();
    // clientRef.current = client;

    return () => {
      stompClient.deactivate();
      setClient(null);
    };
  }, [roomCode, onMessage]);

  return client;
};

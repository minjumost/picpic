import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { StompMessage } from "../types/stomp";

export const useStomp = (
  roomCode: string | null,
  onMessage: (msg: StompMessage) => void
) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    const socket = new SockJS(`${import.meta.env.VITE_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      debug: (str) => console.log("[STOMP DEBUG]:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/room/${roomCode}`, (message: IMessage) => {
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

      client.publish({
        destination: "/app/room/enter",
        body: JSON.stringify({ code: roomCode }),
      });
    };

    client.onStompError = (frame) => {
      console.error("[STOMP ERROR]", frame.headers["message"]);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomCode, onMessage]);

  return clientRef;
};

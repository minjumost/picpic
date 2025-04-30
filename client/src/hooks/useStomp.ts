import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useStomp = (roomCode: string | null) => {
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
      // 구독
      client.subscribe(`/topic/room/${roomCode}`, (message: IMessage) => {
        const body = JSON.parse(message.body);
        if (body.type === "INIT") {
          console.log("[ROOM INIT]", body.data);
        } else if (body.type === "UPDATE") {
          console.log("[ROOM UPDATE]", body.data);
        }
      });

      // 입장
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
  }, [roomCode]);

  return clientRef;
};

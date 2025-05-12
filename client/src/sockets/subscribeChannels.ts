import type { Client } from "@stomp/stompjs";
import { stompClient } from "./stompClient";

export const subscribeChannels = (
  sessionCode: string,
  onBroadcast: (msg: Client) => void,
  onPrivate: (msg: Client) => void
) => {
  if (!stompClient || !stompClient.connected) {
    console.error("Stomp client is not connected yet.");
    return;
  }

  stompClient.subscribe(`/broadcast/${sessionCode}`, (message) => {
    const data = JSON.parse(message.body);
    onBroadcast(data);
  });

  stompClient.subscribe("/user/private", (message) => {
    const data = JSON.parse(message.body);
    onPrivate(data);
  });
};

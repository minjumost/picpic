import stompClient from "./stompClient";

type Point = {
  x: number;
  y: number;
};

export type DrawStrokePayload = {
  sessionId: number;
  sessionCode: string;
  color: string;
  lineWidth: number;
  points: Point[];
  tool: string;
};

export const connectAndEnterSession = (
  sessionCode: string,
  password: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!stompClient.connected) {
      return;
    }
    stompClient.publish({
      destination: "/send/session/enter",
      body: JSON.stringify({ sessionCode, password }),
    });

    resolve();

    stompClient.onStompError = (frame) => {
      reject(frame);
    };
  });
};

export const sendSessionStart = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    return;
  }

  stompClient.publish({
    destination: "/send/session/start",
    body: JSON.stringify({ sessionId, sessionCode }),
  });
};

export const sendDrawStroke = (payload: DrawStrokePayload) => {
  if (!stompClient || !stompClient.connected) {
    return;
  }

  stompClient.publish({
    destination: "/send/stroke",
    body: JSON.stringify({
      ...payload,
    }),
  });
};

export const sendPhotoStart = (
  sessionId: number,
  sessionCode: string,
  slotIndex: number
) => {
  if (!stompClient.connected) {
    return;
  }

  stompClient.publish({
    destination: "/send/photo/start",
    body: JSON.stringify({
      sessionId,
      sessionCode,
      slotIndex,
    }),
  });
};

export const sendPhotoUpload = (
  sessionId: number,
  sessionCode: string,
  slotIndex: number,
  url: string
) => {
  if (!stompClient.connected) {
    return;
  }

  stompClient.publish({
    destination: "/send/photo/upload",
    body: JSON.stringify({
      sessionId,
      sessionCode,
      slotIndex,
      url,
    }),
  });
};

export const sendDrawStart = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    return;
  }

  stompClient.publish({
    destination: "/send/stroke/start",
    body: JSON.stringify({ sessionId, sessionCode }),
  });
};

export const sendDrawReady = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    return;
  }

  stompClient.publish({
    destination: "/send/stroke/ready",
    body: JSON.stringify({ sessionId, sessionCode }),
  });
};

export const sendCollageStart = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    return;
  }

  stompClient.publish({
    destination: "/send/collage/start",
    body: JSON.stringify({ sessionId, sessionCode }),
  });
};

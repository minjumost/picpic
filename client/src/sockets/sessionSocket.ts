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
    stompClient.publish({
      destination: "/send/session/enter",
      body: JSON.stringify({ sessionCode, password }),
    });

    resolve();

    stompClient.onStompError = (frame) => {
      console.error("STOMP Error:", frame);
      reject(frame);
    };
  });
};

export const sendSessionStart = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    console.warn("❌ stompClient가 아직 연결되지 않았습니다.");
    return;
  }

  stompClient.publish({
    destination: "/send/session/start",
    body: JSON.stringify({ sessionId, sessionCode }),
  });

  console.log("📨 세션 시작 요청 전송 완료");
};

export const sendDrawStroke = (payload: DrawStrokePayload) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("❌ STOMP 연결되지 않음. 메시지를 보낼 수 없습니다.");
    return;
  }

  stompClient.publish({
    destination: "/send/stroke",
    body: JSON.stringify({
      ...payload,
    }),
  });

  console.log("📤 stroke 메시지 전송:", payload);
};

export const sendPhotoStart = (
  sessionId: number,
  sessionCode: string,
  slotIndex: number
) => {
  if (!stompClient.connected) {
    console.warn("❌ stompClient가 아직 연결되지 않았습니다.");
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

  console.log("📨 사진 촬영 시작 메시지 전송");
};

export const sendPhotoUpload = (
  sessionId: number,
  sessionCode: string,
  slotIndex: number,
  url: string
) => {
  if (!stompClient.connected) {
    console.warn("❌ stompClient가 아직 연결되지 않았습니다.");
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

  console.log("📨 사진 업로드 완료 메시지 전송");
};

export const sendDrawStart = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    console.warn("❌ stompClient가 아직 연결되지 않았습니다.");
    return;
  }

  stompClient.publish({
    destination: "/send/stroke/start",
    body: JSON.stringify({ sessionId, sessionCode }),
  });
};

export const sendDrawReady = (sessionId: number, sessionCode: string) => {
  if (!stompClient.connected) {
    console.warn("❌ stompClient가 아직 연결되지 않았습니다.");
    return;
  }

  stompClient.publish({
    destination: "/send/stroke/ready",
    body: JSON.stringify({ sessionId, sessionCode }),
  });
};

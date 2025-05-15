export type UploadType = "photo" | "collage";

export interface PresignedUrlResponse {
  presignedUrl: string;
  imageUrl: string;
}

// WebSocket 메시지 타입 예시 (필요시 확장)
export interface PhotoSubmitMessage {
  type: "photo_upload";
  slot_index: number;
  url: string;
}

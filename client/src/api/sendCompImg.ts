import { useMutation } from "@tanstack/react-query";
import { client } from "./axios";

interface CollagePayload {
  sessionId: number;
  collageImageUrl: string;
}

const postCollageImage = async (payload: CollagePayload) => {
  const response = await client.post("/api/v1/collage", payload);
  return response.data;
};

export const usePostCollageImage = () => {
  return useMutation({
    mutationFn: postCollageImage,
  });
};

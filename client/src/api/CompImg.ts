import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "./axios";

interface CollagePayload {
  sessionId: number;
  collageImageUrl: string;
}

const postCollageImage = async (payload: CollagePayload) => {
  const response = await client.post("/api/v1/collage", payload);
  return response.data;
};

const getCollageImage = async (sessionId: number) => {
  const response = await client.get(`/api/v1/collages/${sessionId}`);
  return response.data.result;
};

export const useGetCollageImage = (sessionId: number) => {
  return useQuery({
    queryKey: ["getCollage"],
    queryFn: () => getCollageImage(sessionId),
  });
};

export const usePostCollageImage = () => {
  return useMutation({
    mutationFn: postCollageImage,
  });
};

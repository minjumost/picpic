import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, client } from "./axios";
import type { Image } from "./getImage";

export interface FinalImageResponse {
  slotIndex: number;
  editedImageUrl: string;
}

const getFinalImages = async (sessionId: number): Promise<Image[]> => {
  const response = await client.get<ApiResponse<Image[]>>(
    `api/v1/collage/${sessionId}`
  );
  console.log(response);
  return response.data.result;
};

export const useGetFinalImages = (sessionId: number) => {
  return useQuery({
    queryKey: ["FinalImages", sessionId],
    queryFn: () => getFinalImages(sessionId),
    enabled: !!sessionId,
  });
};

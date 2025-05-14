import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, client } from "./axios";

export interface Image {
  slotIndex: number;
  photoImageUrl: string;
}

const getImages = async (sessionId: number): Promise<Image> => {
  const response = await client.get<ApiResponse<Image>>(`/photos/${sessionId}`);
  console.log(response);
  return response.data.result;
};

export const useGetImages = (sessionId: number) => {
  return useQuery({
    queryKey: ["Backgrounds", sessionId],
    queryFn: () => getImages(sessionId),
    enabled: !!sessionId,
  });
};

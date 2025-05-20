import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, client } from "./axios";

export interface Image {
  slotIndex: number;
  photoImageUrl: string;
}

export interface Collage {
  collageImageUrl: string;
}

const getImages = async (sessionId: number): Promise<Collage> => {
  const response = await client.get<ApiResponse<Collage>>(
    `/api/v1/collage/${sessionId}`
  );

  return response.data.result;
};

export const getSessionImages = async (sessionId: number): Promise<Image[]> => {
  const response = await client.get<ApiResponse<Image[]>>(
    `/api/v1/session/${sessionId}/photos`
  );

  return response.data.result;
};

export const useGetImages = (sessionId: number) => {
  return useQuery({
    queryKey: ["Backgrounds", sessionId],
    queryFn: () => getImages(sessionId),
    enabled: !!sessionId,
  });
};

export const useGetSessionImages = (sessionId: number) => {
  return useQuery({
    queryKey: ["sessionImage"],
    queryFn: () => getSessionImages(sessionId),
    enabled: !!sessionId,
  });
};

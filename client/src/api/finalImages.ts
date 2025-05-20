import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, client } from "./axios";

export interface FinalImageResponse {
  collageImageUrl: string;
}

const getFinalImages = async (
  sessionId: number
): Promise<FinalImageResponse> => {
  const response = await client.get<ApiResponse<FinalImageResponse>>(
    `api/v1/collages/${sessionId}`
  );
  return response.data.result;
};

export const useGetFinalImages = (sessionId: number) => {
  return useQuery({
    queryKey: ["FinalImages", sessionId],
    queryFn: () => getFinalImages(sessionId),
    enabled: !!sessionId,
  });
};

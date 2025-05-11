import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, client } from "./axios";

export interface BackImageResponse {
  backgroundId: number;
  name: string;
  backgroundImageUrl: string;
}

const getBackgrounds = async (): Promise<BackImageResponse> => {
  const response = await client.get<ApiResponse<BackImageResponse>>(
    "/api/v1/backgrounds"
  );
  console.log(response);
  return response.data.result;
};

export const useGetBackgrounds = () => {
  return useQuery({
    queryKey: ["Backgrounds"],
    queryFn: getBackgrounds,
  });
};

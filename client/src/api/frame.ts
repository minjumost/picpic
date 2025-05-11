import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, client } from "./axios";

interface FrameResponse {
  frameId: number;
  name: string;
  slotCount: number;
  frameImageUrl: string;
}

const getFrames = async (): Promise<FrameResponse> => {
  const response = await client.get<ApiResponse<FrameResponse>>(
    "/api/v1/frames"
  );
  console.log(response);
  return response.data.result;
};

export const useGetFrames = () => {
  return useQuery({
    queryKey: ["frames"],
    queryFn: getFrames,
  });
};

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, client } from "./axios";

export interface FrameResponse {
  frameId: number;
  name: string;
  slotCount: number;
  frameImageUrl: string;
}

type FrameWithoutName = Omit<FrameResponse, "name">;

const getFrames = async (): Promise<FrameResponse[]> => {
  const response = await client.get<ApiResponse<FrameResponse[]>>(
    "/api/v1/frames"
  );

  return response.data.result;
};

const getSelectedFrames = async (
  sessionId: number
): Promise<FrameWithoutName> => {
  const response = await client.get<ApiResponse<FrameWithoutName>>(
    `/api/v1/session/${sessionId}/frame`
  );

  return response.data.result;
};

export const useGetFrames = () => {
  return useQuery({
    queryKey: ["frames"],
    queryFn: getFrames,
  });
};

export const useGetSelectedFrames = (sessionId: number) => {
  return useQuery({
    queryKey: ["selectedFrames"],
    queryFn: () => getSelectedFrames(sessionId),
  });
};

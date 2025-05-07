import { ApiResponse, client } from "./axios";

interface CreateRoomResponse {
  code: string;
}

export const getRoomCode = async (): Promise<CreateRoomResponse> => {
  const { data } = await client.post<ApiResponse<CreateRoomResponse>>(
    "/api/v1/room"
  );
  return data.result;
};

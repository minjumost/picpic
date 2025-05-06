import { ApiResponse, client } from "./axios";
import { PlacedObj } from "../types/object";

interface GetPlacedObjectsPayload {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const getPlacedObjects = async (
  code: string,
  payload: GetPlacedObjectsPayload
): Promise<PlacedObj[]> => {
  const { data } = await client.post<ApiResponse<PlacedObj[]>>(
    `/api/v1/room/${code}/objects`,
    payload
  );
  return data.result;
};

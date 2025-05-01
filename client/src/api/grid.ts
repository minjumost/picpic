import { client } from "./axios";
import { PlacedObject } from "../types/object";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

interface GetPlacedObjectsPayload {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const getPlacedObjects = async (
  code: string,
  payload: GetPlacedObjectsPayload
): Promise<PlacedObject[]> => {
  const { data } = await client.post<ApiResponse<PlacedObject[]>>(
    `/api/v1/room/${code}/objects`,
    payload
  );
  return data.result;
};

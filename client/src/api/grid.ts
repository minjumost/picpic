import { client } from "./axios";
import { PlacedObject } from "../types/object";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

export const getPlacedObjects = async (): Promise<PlacedObject[]> => {
  const { data } = await client.get<ApiResponse<PlacedObject[]>>(
    "/placed-objects"
  );
  return data.result;
};

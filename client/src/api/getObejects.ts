import { ApiResponse, client } from "./axios";

export interface BaseObject {
  id: number;
  type: number;
  imageUrl: string;
  width: number;
  height: number;
  creadtedAt: string;
  updatedAt: string;
}
export interface ObjectResponse {
  tiles: BaseObject[];
  objects: BaseObject[];
  walls: BaseObject[];
}

export const getObjects = async (): Promise<ObjectResponse> => {
  const { data } = await client.get<ApiResponse<ObjectResponse>>(
    `/api/v1/objects`
  );
  return data.result ?? [];
};

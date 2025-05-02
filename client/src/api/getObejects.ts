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

export const getObjects = async () => {
  const { data } = await client.get<ApiResponse<BaseObject[]>>(
    `/api/v1/objects`
  );
  return data.result ?? [];
};

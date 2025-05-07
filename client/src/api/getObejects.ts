import { mockup } from "../mocks/item";
import { BaseObject } from "../types/object";
import { ApiResponse, client } from "./axios";

export interface ObjectResponse {
  tiles: BaseObject[];
  objects: BaseObject[];
  walls: BaseObject[];
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
  return data.result ?? mockup;
};

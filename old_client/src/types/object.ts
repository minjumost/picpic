export const OBJECT_TYPES = {
  TILE: 0,
  OBJECT: 1,
  WALL: 2,
} as const;

export type ObjectType = (typeof OBJECT_TYPES)[keyof typeof OBJECT_TYPES];

export interface BaseObject {
  id: number;
  type: number;
  imageUrl: string;
  width: number;
  height: number;
}

export interface PlacedObj extends Omit<BaseObject, "id"> {
  objectId: number;
  roomObjectId: number;
  posX: number;
  posY: number;
}

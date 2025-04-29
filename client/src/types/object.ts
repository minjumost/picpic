export const OBJECT_TYPES = ["tile", "furniture", "wall"] as const;

export type ObjectType = (typeof OBJECT_TYPES)[number];

export interface ServerObject {
  id: number;
  width: number;
  height: number;
  type: ObjectType;
  src: string;
}

export interface PlacedObject extends ServerObject {
  positionX: number;
  positionY: number;
}

export const CATEGORIES = [
  { key: "furniture", label: "가구" },
  { key: "tile", label: "타일" },
  { key: "wall", label: "벽" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

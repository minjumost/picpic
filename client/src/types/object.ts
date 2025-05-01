export const OBJECT_TYPES = {
  TILE: 0,
  OBJECT: 1,
  WALL: 2,
} as const;

export type ObjectType = (typeof OBJECT_TYPES)[keyof typeof OBJECT_TYPES];

export const OBJECT_TYPE_LABELS: Record<ObjectType, string> = {
  [OBJECT_TYPES.TILE]: "타일",
  [OBJECT_TYPES.OBJECT]: "소품",
  [OBJECT_TYPES.WALL]: "벽",
};

export interface ServerObject {
  id: number;
  width: number;
  height: number;
  type: ObjectType;
  src: string;
}

export interface PlacedObject {
  id: number;
  posX: number;
  posY: number;
  width: number;
  height: number;
  imageUrl: string;
  type: ObjectType;
}

export const CATEGORIES = [
  { key: OBJECT_TYPES.TILE, label: "타일" },
  { key: OBJECT_TYPES.OBJECT, label: "소품" },
  { key: OBJECT_TYPES.WALL, label: "벽" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

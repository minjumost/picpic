import { OBJECT_TYPES, PlacedObject, ObjectType } from "../types/object";
import { FurniturePlacedPayload } from "../types/stomp";

export const toPlacedObjectFromPayload = (
  payload: FurniturePlacedPayload
): PlacedObject => {
  return {
    id: payload.roomObjectId,
    posX: payload.posX,
    posY: payload.posY,
    width: payload.width,
    height: payload.height,
    imageUrl: payload.imageUrl,
    type: getTypeFromCategory(payload.category),
  };
};

const getTypeFromCategory = (category: string): ObjectType => {
  switch (category) {
    case "tile":
      return OBJECT_TYPES.TILE;
    case "wall":
      return OBJECT_TYPES.WALL;
    case "furniture":
      return OBJECT_TYPES.OBJECT;
    default:
      throw new Error("Unknown category: " + category);
  }
};

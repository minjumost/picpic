import { OBJECT_TYPES, PlacedObject, ObjectType } from "../types/object";
import { FurniturePlacedPayload } from "../types/stomp";

export const toPlacedObjectFromPayload = (
  payload: FurniturePlacedPayload
): PlacedObject => {
  console.log(payload);
  return {
    id: payload.roomObjectId,
    posX: payload.posX,
    posY: payload.posY,
    width: payload.width,
    height: payload.height,
    imageUrl: payload.imageUrl,
    type: getTypeFromCategory(payload.type),
  };
};

const getTypeFromCategory = (category: number): ObjectType => {
  switch (category) {
    case 0:
      return OBJECT_TYPES.TILE;
    case 1:
      return OBJECT_TYPES.WALL;
    case 2:
      return OBJECT_TYPES.OBJECT;
    default:
      throw new Error("Unknown category: " + category);
  }
};

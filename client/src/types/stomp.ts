export interface FurniturePlacedPayload {
  roomObjectId: number;
  posX: number;
  posY: number;
  width: number;
  height: number;
  imageUrl: string;
  category: string;
  objectId: number;
}

export type StompMessage =
  | {
      type: "furniture_placed";
      payload: FurniturePlacedPayload;
    }
  | {
      type: "object_moved";
      payload: {
        roomObjectId: number;
        posX: number;
        posY: number;
      };
    }
  | {
      type: "object_removed";
      payload: {
        roomObjectId: number;
      };
    };

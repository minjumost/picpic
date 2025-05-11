import { PlacedObj } from "./object";

export type StompMessage =
  | {
      type: "object_placed";
      payload: PlacedObj;
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

import furnitureImage from "../assets/furnitures/test_furniture.png";
import Chair from "../assets/furnitures/Chair_back.png";
import ChalkBoard from "../assets/furnitures/chalkboard.png";
import tileImage from "../assets/tiles/test_tile2.png";
import { ObjectResponse } from "../api/getObejects";
import { BaseObject } from "../types/object";

export const objects: BaseObject[] = [
  {
    id: 1,
    width: 50,
    height: 50,
    type: 1,
    imageUrl: furnitureImage,
  },
  {
    id: 2,
    width: 30,
    height: 30,
    type: 1,
    imageUrl: Chair,
  },
  {
    id: 3,
    width: 200,
    height: 50,
    type: 1,
    imageUrl: ChalkBoard,
  },
];

export const tiles: BaseObject[] = [
  {
    id: 4,
    width: 50,
    height: 50,
    type: 0,
    imageUrl: tileImage,
  },
];

export const walls: BaseObject[] = [
  {
    id: 5,
    width: 50,
    height: 50,
    type: 2,
    imageUrl: tileImage,
  },
];

export const mockup: ObjectResponse = {
  tiles: tiles,
  objects: objects,
  walls: walls,
};

import { ServerObject } from "../types/object";
import furnitureImage from "../assets/furnitures/test_furniture.png";
import Chair from "../assets/furnitures/Chair_back.png";
import ChalkBoard from "../assets/furnitures/chalkboard.png";
import tileImage from "../assets/tiles/test_tile2.png";

export const furnitures: ServerObject[] = [
  {
    id: 1,
    width: 50,
    height: 50,
    type: 1,
    src: furnitureImage,
  },
  {
    id: 2,
    width: 30,
    height: 30,
    type: 1,
    src: Chair,
  },
  {
    id: 3,
    width: 200,
    height: 50,
    type: 1,
    src: ChalkBoard,
  },
];

export const tiles: ServerObject[] = [
  {
    id: 4,
    width: 50,
    height: 50,
    type: 0,
    src: tileImage,
  },
];

export const walls: ServerObject[] = [
  {
    id: 5,
    width: 50,
    height: 50,
    type: 2,
    src: tileImage,
  },
];

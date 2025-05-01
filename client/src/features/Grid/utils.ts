import { CELL_SIZE } from "../../constants/grid";
import { OBJECT_TYPES, PlacedObject } from "../../types/object";
import { Client } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";

interface GridPosition {
  row: number;
  col: number;
}

interface Point {
  x: number;
  y: number;
}

export const calculateGridPosition = (
  point: Point,
  cellSize: number,
  minCoord: number
): GridPosition => {
  const col = Math.floor((point.x - minCoord) / cellSize);
  const row = Math.floor((point.y - minCoord) / cellSize);
  return { row, col };
};

export const isSamePosition = (
  pos1: GridPosition,
  pos2: GridPosition
): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

export const calculateObjectPosition = (
  gridPosition: GridPosition,
  cellSize: number
): Point => {
  return {
    x: gridPosition.col * cellSize,
    y: gridPosition.row * cellSize,
  };
};

// 특정 셀에 타일 타입 오브젝트가 있는지 확인하는 함수
export const hasTileInCell = (
  col: number,
  row: number,
  placedObjects: PlacedObject[]
) => {
  return placedObjects.some(
    (obj) =>
      obj.type === OBJECT_TYPES.TILE &&
      obj.posX === col * CELL_SIZE &&
      obj.posY === row * CELL_SIZE
  );
};

// 같은 오브젝트 중복 체크 (이미지 URL로 비교)
export const hasSameObjectInCell = (
  col: number,
  row: number,
  imageUrl: string,
  placedObjects: PlacedObject[]
) => {
  return placedObjects.some(
    (obj) =>
      obj.imageUrl === imageUrl && // id 대신 이미지 URL로 비교
      obj.posX === col * CELL_SIZE &&
      obj.posY === row * CELL_SIZE
  );
};

// 선택된 셀의 오브젝트들 찾기
export const getSelectedCellObjects = (
  selectedCell: { row: number; col: number },
  placedObjects: PlacedObject[]
) => {
  if (!selectedCell) return [];

  const cellX = selectedCell.col * CELL_SIZE;
  const cellY = selectedCell.row * CELL_SIZE;

  return placedObjects.filter(
    (obj) => obj.posX === cellX && obj.posY === cellY
  );
};

export const sendPlaceObjectMessage = ({
  client,
  code,
  object,
}: {
  client: Client | null;
  code: string;
  object: PlacedObject;
}) => {
  if (!client || !client.connected) {
    console.warn("[STOMP] 연결되지 않았거나 client 없음");
    return;
  }

  client.publish({
    destination: `/app/room/object/place`,
    body: JSON.stringify({
      code: code,
      roomObjectId: object.id,
      posX: object.posX,
      posY: object.posY,
    }),
  });
};

export const sendRemoveObjectMessage = ({
  client,
  code,
  object,
}: {
  client: Client | null;
  code: string;
  object: PlacedObject;
}) => {
  if (!client || !client.connected) {
    console.warn("[STOMP] 연결되지 않았거나 client 없음");
    return;
  }

  client.publish({
    destination: `/app/room/object/delete`,
    body: JSON.stringify({
      code: code,
      roomObjectId: object.id,
    }),
  });
};

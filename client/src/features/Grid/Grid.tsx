import Konva from "konva";
import { useState, useMemo, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { useObjectStore } from "../../store/objectStore";
import createGridLines from "./GridLines";
import { OBJECT_TYPES } from "../../types/object";
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  CELL_SIZE,
  MIN_COORD,
  MAX_COORD,
} from "../../constants/grid";
import {
  calculateGridPosition,
  getSelectedCellObjects,
  hasSameObjectInCell,
  hasTileInCell,
} from "./utils";
import PlacedObjects from "./PlacedObjects";
import SelectionOverlay from "./SelectionOverlay";
import { useQuery } from "@tanstack/react-query";
import { getPlacedObjects } from "../../api/grid";
import TopSheet from "../Sheet/TopSheet";
import { StompMessage } from "../../types/stomp";
import { toPlacedObjectFromPayload } from "../../utils/stompMsgMapper";

interface GridProps {
  code: string;
  stompMessage: StompMessage | null;
}

const Grid = ({ code, stompMessage }: GridProps) => {
  const {
    selectedObject,
    placedObjects,
    addPlacedObject,
    initPlacedObjects,
    movePlacedObject,
    removePlacedObjectById,
  } = useObjectStore();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [showTopSheet, setShowTopSheet] = useState(false);

  // 서버에서 기존 배치된 오브젝트 목록 조회
  const { data: serverPlacedObjects = [] } = useQuery({
    queryKey: ["placedObjects", code],
    queryFn: () =>
      getPlacedObjects(code, {
        startX: 1,
        startY: 1,
        endX: 10,
        endY: 10,
      }),
  });

  useEffect(() => {
    if (!stompMessage) return;
    const { type, payload } = stompMessage;

    if (type === "furniture_placed") {
      addPlacedObject(toPlacedObjectFromPayload(payload));
    }

    if (type === "object_moved") {
      movePlacedObject(payload.roomObjectId, {
        posX: payload.posX,
        posY: payload.posY,
      });
    }

    if (type === "object_removed") {
      removePlacedObjectById(payload.roomObjectId);
    }
  }, [stompMessage]);

  useEffect(() => {
    if (serverPlacedObjects.length > 0) {
      initPlacedObjects(serverPlacedObjects);
    }
  }, [serverPlacedObjects]);

  // 특정 셀에 타일 타입 오브젝트가 있는지 확인하는 함수
  const hasTileInCell = (col: number, row: number) => {
    return placedObjects.some(
      (obj) =>
        obj.type === OBJECT_TYPES.TILE &&
        obj.posX === col * CELL_SIZE &&
        obj.posY === row * CELL_SIZE
    );
  };

  // 같은 오브젝트 중복 체크 (이미지 URL로 비교)
  const hasSameObjectInCell = (col: number, row: number, imageUrl: string) => {
    return placedObjects.some(
      (obj) =>
        obj.imageUrl === imageUrl && // id 대신 이미지 URL로 비교
        obj.posX === col * CELL_SIZE &&
        obj.posY === row * CELL_SIZE
    );
  };

  // 선택된 셀의 오브젝트들 찾기
  const getSelectedCellObjects = () => {
    if (!selectedCell) return [];

    const cellX = selectedCell.col * CELL_SIZE;
    const cellY = selectedCell.row * CELL_SIZE;

    return placedObjects.filter(
      (obj) => obj.posX === cellX && obj.posY === cellY
    );
  };

  const gridLines = useMemo(
    () => createGridLines(MIN_COORD, MAX_COORD, CELL_SIZE),
    []
  );

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const gridPosition = calculateGridPosition(
      { x: pointer.x, y: pointer.y },
      CELL_SIZE,
      MIN_COORD
    );

    if (selectedObject) {
      setShowTopSheet(false);
      setSelectedCell(null);

      if (selectedObject.type === OBJECT_TYPES.TILE) {
        if (hasTileInCell(gridPosition.col, gridPosition.row, placedObjects)) {
          console.warn("이미 타일이 배치되어 있습니다.");
          return;
        }
      } else if (
        (selectedObject.type === OBJECT_TYPES.OBJECT ||
          selectedObject.type === OBJECT_TYPES.WALL) &&
        hasSameObjectInCell(
          gridPosition.col,
          gridPosition.row,
          selectedObject.src,
          placedObjects
        )
      ) {
        console.warn("이미 같은 오브젝트가 배치되어 있습니다.");
        return;
      }

      addPlacedObject({
        id: selectedObject.id,
        posX: gridPosition.col * CELL_SIZE,
        posY: gridPosition.row * CELL_SIZE,
        width: selectedObject.width,
        height: selectedObject.height,
        imageUrl: selectedObject.src,
        type: selectedObject.type,
      });

      return;
    }

    setSelectedCell((prev) => {
      if (
        prev &&
        prev.row === gridPosition.row &&
        prev.col === gridPosition.col
      ) {
        setShowTopSheet(false);
        return null;
      }
      setShowTopSheet(true);
      return gridPosition;
    });
  };

  return (
    <>
      {showTopSheet && selectedCell && !selectedObject && (
        <TopSheet
          objects={getSelectedCellObjects(selectedCell, placedObjects)}
          onClose={() => {
            setShowTopSheet(false);
            setSelectedCell(null);
          }}
        />
      )}
      <div id="scroll-wrapper" className="w-full h-full overflow-auto">
        <Stage width={GRID_WIDTH} height={GRID_HEIGHT} onClick={handleClick}>
          <Layer listening={false}>
            {gridLines}
            <PlacedObjects objects={placedObjects} cellSize={CELL_SIZE} />
            <SelectionOverlay
              selectedCell={selectedCell}
              cellSize={CELL_SIZE}
            />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default Grid;

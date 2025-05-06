import Konva from "konva";
import { useState, useMemo, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { Stage, Layer } from "react-konva";
import { useObjectStore } from "../../store/objectStore";
import createGridLines from "./GridLines";
import { OBJECT_TYPES, PlacedObj } from "../../types/object";
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  CELL_SIZE,
  MIN_COORD,
  MAX_COORD,
} from "../../constants/grid";
import {
  calculateGridPosition,
  generateUniqueId,
  getSelectedCellObjects,
  hasSameObjectInCell,
  hasTileInCell,
  sendPlaceObjectMessage,
} from "./utils";
import PlacedObjects from "./PlacedObjects";
import SelectionOverlay from "./SelectionOverlay";
import { useQuery } from "@tanstack/react-query";
import { getPlacedObjects } from "../../api/grid";
import TopSheet from "../Sheet/TopSheet";
import { StompMessage } from "../../types/stomp";

interface GridProps {
  code: string;
  stompMessage: StompMessage | null;
  stompClient: Client | null;
}

const ACTION_TYPE = {
  PLACED: "object_placed",
  MOVED: "object_moved",
  REMOVE: "object_removed",
} as const;

const Grid = ({ code, stompMessage, stompClient }: GridProps) => {
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
  const {
    data: serverPlacedObjects = [],
    isLoading,
    error,
  } = useQuery({
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

    if (type === ACTION_TYPE.PLACED) {
      console.log(payload);
      addPlacedObject(payload);
    }

    if (type === ACTION_TYPE.MOVED) {
      movePlacedObject(payload.roomObjectId, {
        posX: payload.posX,
        posY: payload.posY,
      });
    }

    if (type === ACTION_TYPE.REMOVE) {
      removePlacedObjectById(payload.roomObjectId);
    }
  }, [stompMessage]);

  const gridLines = useMemo(
    () => createGridLines(MIN_COORD, MAX_COORD, CELL_SIZE),
    []
  );

  useEffect(() => {
    if (!isLoading && !error && serverPlacedObjects) {
      initPlacedObjects(serverPlacedObjects);
    }
  }, [isLoading, error, serverPlacedObjects]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !serverPlacedObjects)
    return (
      <div>
        데이터를 불러올 수 없습니다.
        <br /> 네트워크를 확인해주세요
      </div>
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
          selectedObject.imageUrl,
          placedObjects
        )
      ) {
        console.warn("이미 같은 오브젝트가 배치되어 있습니다.");
        return;
      }

      const newObject: PlacedObj = {
        ...selectedObject,
        objectId: selectedObject.id,
        posX: gridPosition.col * CELL_SIZE,
        posY: gridPosition.row * CELL_SIZE,
        roomObjectId: generateUniqueId(),
      };

      addPlacedObject(newObject);
      sendPlaceObjectMessage({ client: stompClient, code, object: newObject });

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
          stompClient={stompClient}
          code={code}
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

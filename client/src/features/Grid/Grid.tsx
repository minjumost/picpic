import Konva from "konva";
import { useState, useMemo } from "react";
import { Stage, Layer } from "react-konva";
import { useObjectStore } from "../../store/objectStore";
import createGridLines from "./GridLines";
import { PlacedObject } from "../../types/object";
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  CELL_SIZE,
  MIN_COORD,
  MAX_COORD,
} from "../../constants/grid";
import { calculateGridPosition } from "./utils";
import PlacedObjects from "./PlacedObjects";
import SelectionOverlay from "./SelectionOverlay";
import { useQuery } from "@tanstack/react-query";
import { getPlacedObjects } from "../../api/grid";
import TopSheet from "../Sheet/TopSheet";

const Grid = () => {
  const { selectedObject } = useObjectStore();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // 로컬 상태로 배치된 오브젝트 관리 (신규 배치용)
  const [newPlacedObjects, setNewPlacedObjects] = useState<PlacedObject[]>([]);

  // 서버에서 기존 배치된 오브젝트 목록 조회
  const { data: serverPlacedObjects = [] } = useQuery({
    queryKey: ["placedObjects"],
    queryFn: getPlacedObjects,
  });

  // 서버 데이터와 로컬 데이터 합치기
  const allPlacedObjects = [...serverPlacedObjects, ...newPlacedObjects];

  // 선택된 셀의 오브젝트들 찾기
  const getSelectedCellObjects = () => {
    if (!selectedCell) return [];

    const cellX = selectedCell.col * CELL_SIZE;
    const cellY = selectedCell.row * CELL_SIZE;

    return allPlacedObjects.filter(
      (obj) => obj.posX === cellX && obj.posY === cellY
    );
  };

  const gridLines = useMemo(
    () => createGridLines(MIN_COORD, MAX_COORD, CELL_SIZE),
    [MIN_COORD, MAX_COORD, CELL_SIZE]
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

    // 셀 선택은 항상 가능하도록 수정
    setSelectedCell((prev) => {
      if (
        prev &&
        prev.row === gridPosition.row &&
        prev.col === gridPosition.col
      ) {
        return null;
      }
      return gridPosition;
    });

    // 오브젝트 배치는 selectedObject가 있을 때만
    if (selectedObject) {
      setNewPlacedObjects((prev) => [
        ...prev,
        {
          ...selectedObject,
          posX: gridPosition.col * CELL_SIZE,
          posY: gridPosition.row * CELL_SIZE,
          imageUrl: selectedObject.src,
        },
      ]);
    }
  };

  return (
    <>
      <TopSheet objects={getSelectedCellObjects()} />
      <div id="scroll-wrapper" className="w-full h-full overflow-auto">
        <Stage width={GRID_WIDTH} height={GRID_HEIGHT} onClick={handleClick}>
          <Layer listening={false}>
            {gridLines}
            <PlacedObjects objects={allPlacedObjects} cellSize={CELL_SIZE} />
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

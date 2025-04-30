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

const Grid = () => {
  const { selectedObject } = useObjectStore();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);

  const gridLines = useMemo(
    () => createGridLines(MIN_COORD, MAX_COORD, CELL_SIZE),
    [MIN_COORD, MAX_COORD, CELL_SIZE]
  );

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer || !selectedObject) return;

    const gridPosition = calculateGridPosition(
      { x: pointer.x, y: pointer.y },
      CELL_SIZE,
      MIN_COORD
    );

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

    setPlacedObjects((prev) => [
      ...prev,
      {
        ...selectedObject,
        posX: gridPosition.col * CELL_SIZE,
        posY: gridPosition.row * CELL_SIZE,
        imageUrl: selectedObject.src,
      },
    ]);
  };

  return (
    <div id="scroll-wrapper" className="w-full h-full overflow-auto">
      <Stage width={GRID_WIDTH} height={GRID_HEIGHT} onClick={handleClick}>
        <Layer listening={false}>
          {gridLines}
          <PlacedObjects objects={placedObjects} cellSize={CELL_SIZE} />
          <SelectionOverlay selectedCell={selectedCell} cellSize={CELL_SIZE} />
        </Layer>
      </Stage>
    </div>
  );
};

export default Grid;

import Konva from "konva";
import { useState, useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useObjectStore } from "../../store/objectStore";
import GridImage from "./GridImage";
import createGridLines from "./GridLines";
import { PlacedObject } from "../../types/object";

const Grid = () => {
  const logicalWidth = 2500;
  const logicalHeight = 2500;

  const cellSize = 50;
  const minCoord = 0;
  const maxCoord = 2500;

  const { selectedObject } = useObjectStore();

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);

  const gridLines = useMemo(
    () => createGridLines(minCoord, maxCoord, cellSize),
    [minCoord, maxCoord, cellSize]
  );

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer || !selectedObject) return;

    const x = pointer.x;
    const y = pointer.y;

    const col = Math.floor((x - minCoord) / cellSize);
    const row = Math.floor((y - minCoord) / cellSize);

    setSelectedCell((prev) => {
      if (prev && prev.row === row && prev.col === col) {
        return null;
      }
      return { row, col };
    });

    setPlacedObjects((prev) => [
      ...prev,
      {
        ...selectedObject,
        positionX: col * cellSize,
        positionY: row * cellSize,
      },
    ]);
  };

  return (
    <div id="scroll-wrapper" className="w-full h-full overflow-auto">
      <Stage width={logicalWidth} height={logicalHeight} onClick={handleClick}>
        <Layer listening={false}>
          {gridLines}

          {placedObjects.map((obj, idx) => (
            <GridImage
              key={idx}
              src={obj.src}
              x={obj.positionX + cellSize / 2}
              y={obj.positionY + cellSize / 2}
              size={cellSize}
              type={obj.type}
              width={obj.width}
              height={obj.height}
            />
          ))}

          {selectedCell && (
            <Rect
              x={selectedCell.col * cellSize}
              y={selectedCell.row * cellSize}
              width={cellSize}
              height={cellSize}
              stroke="red"
              strokeWidth={2}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Grid;

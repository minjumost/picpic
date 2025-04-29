import Konva from "konva";
import { useState, useMemo } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";

function createGridLines(minCoord: number, maxCoord: number, cellSize: number) {
  const lines = [];

  for (let x = minCoord; x <= maxCoord; x += cellSize) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, minCoord, x, maxCoord]}
        stroke="lightgray"
        strokeWidth={1}
        listening={false}
      />
    );
  }

  for (let y = minCoord; y <= maxCoord; y += cellSize) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[minCoord, y, maxCoord, y]}
        stroke="lightgray"
        strokeWidth={1}
        listening={false}
      />
    );
  }

  return lines;
}

const Grid = () => {
  const logicalWidth = 2500;
  const logicalHeight = 2500;

  const cellSize = 50;
  const minCoord = 0;
  const maxCoord = 2500;

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const gridLines = useMemo(
    () => createGridLines(minCoord, maxCoord, cellSize),
    [minCoord, maxCoord, cellSize]
  );

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

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
  };

  return (
    <div id="scroll-wrapper" className="w-full h-full overflow-auto">
      <Stage width={logicalWidth} height={logicalHeight} onClick={handleClick}>
        <Layer listening={false}>
          {gridLines}
          {selectedCell && (
            <Rect
              x={selectedCell.col * cellSize}
              y={selectedCell.row * cellSize}
              width={cellSize}
              height={cellSize}
              stroke="red" // ✨ 빨간 테두리
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

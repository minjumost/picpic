import  { useMemo } from "react";
import { Stage, Layer, Line } from "react-konva";


// ✨ Grid 선 생성 함수
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

  const logicalWidth = 1000; // Stage 실제 크기
  const logicalHeight = 1000;

  const cellSize = 50;
  const minCoord = 0;
  const maxCoord = 1000;

  const gridLines = useMemo(() => createGridLines(minCoord, maxCoord, cellSize), [
    minCoord,
    maxCoord,
    cellSize,
  ]);

  const handleClick = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const x = pointer.x;
    const y = pointer.y;

    const col = Math.floor((x - minCoord) / cellSize);
    const row = Math.floor((y - minCoord) / cellSize);

    console.log(`Clicked cell: Row ${row}, Col ${col}`);
  };

  return (
    <div
      id="scroll-wrapper"
      className="w-[400px] h-full overflow-auto border border-solid"
    >
      <Stage
        width={logicalWidth}
        height={logicalHeight}
        onClick={handleClick}
        style={{ background: "#fff" }}
      >
        <Layer listening={false}>
          {gridLines}
        </Layer>
      </Stage>
    </div>
  );
};

export default Grid;

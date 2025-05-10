import { Line } from "react-konva";

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

export default createGridLines;

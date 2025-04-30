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

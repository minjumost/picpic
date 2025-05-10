import { Rect } from "react-konva";

interface SelectionOverlayProps {
  selectedCell: { row: number; col: number } | null;
  cellSize: number;
}

const SelectionOverlay = ({
  selectedCell,
  cellSize,
}: SelectionOverlayProps) => {
  if (!selectedCell) return null;

  return (
    <Rect
      x={selectedCell.col * cellSize}
      y={selectedCell.row * cellSize}
      width={cellSize}
      height={cellSize}
      stroke="red"
      strokeWidth={2}
      listening={false}
    />
  );
};

export default SelectionOverlay;

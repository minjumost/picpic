// src/features/Grid/components/PlacedObjects.tsx
import { PlacedObject } from "../../types/object";
import GridImage from "./GridImage";

interface PlacedObjectsProps {
  objects: PlacedObject[];
  cellSize: number;
}

const PlacedObjects = ({ objects, cellSize }: PlacedObjectsProps) => {
  return (
    <>
      {objects.map((obj, idx) => (
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
    </>
  );
};

export default PlacedObjects;

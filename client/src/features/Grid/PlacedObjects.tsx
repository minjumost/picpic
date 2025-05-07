// src/features/Grid/components/PlacedObjects.tsx
import { PlacedObj } from "../../types/object";
import GridImage from "./GridImage";

interface PlacedObjectsProps {
  objects: PlacedObj[];
  cellSize: number;
}

const PlacedObjects = ({ objects, cellSize }: PlacedObjectsProps) => {
  return (
    <>
      {objects.map((obj) => (
        <GridImage
          key={obj.roomObjectId}
          imageUrl={obj.imageUrl}
          posX={obj.posX + cellSize / 2}
          posY={obj.posY + cellSize / 2}
          type={obj.type}
          width={obj.width}
          height={obj.height}
          size={cellSize}
        />
      ))}
    </>
  );
};

export default PlacedObjects;

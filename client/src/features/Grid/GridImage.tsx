import { Image } from "react-konva";
import useImage from "use-image";
import { OBJECT_TYPES } from "../../types/object";

interface GridImageProps {
  imageUrl: string;
  posX: number;
  posY: number;
  type: number;
  width: number;
  height: number;
  size: number;
}

const GridImage = ({
  imageUrl,
  posX,
  posY,
  type,
  width,
  height,
  size,
}: GridImageProps) => {
  const [image] = useImage(imageUrl);
  if (!image) return null;

  if (type === OBJECT_TYPES.TILE) {
    return (
      <Image
        image={image}
        x={posX - size / 2}
        y={posY - size / 2}
        width={size}
        height={size}
      />
    );
  }

  if (width > size || height > size) {
    return (
      <Image
        image={image}
        x={posX - size / 2}
        y={posY - size / 2}
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      image={image}
      x={posX - width / 2}
      y={posY - height / 2}
      width={width}
      height={height}
    />
  );
};

export default GridImage;

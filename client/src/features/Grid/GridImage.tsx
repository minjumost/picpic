import { Image } from "react-konva";
import useImage from "use-image";
import { ObjectType } from "../../types/object";

interface GridImageProps {
  src: string;
  x: number;
  y: number;
  size: number;
  type: ObjectType;
  width: number;
  height: number;
}

const GridImage = ({
  src,
  x,
  y,
  size,
  type,
  width,
  height,
}: GridImageProps) => {
  const [image] = useImage(src);
  if (!image) return null;

  if (type === "tile") {
    return (
      <Image
        image={image}
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
      />
    );
  }

  if (width > size || height > size) {
    return (
      <Image
        image={image}
        x={x - size / 2}
        y={y - size / 2}
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      image={image}
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
    />
  );
};

export default GridImage;

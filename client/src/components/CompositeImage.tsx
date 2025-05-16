import type { Image } from "../api/getImage";

const SLOT_POSITIONS = [
  { top: 158, left: 11, width: 338, height: 204 },
  { top: 12, left: 371, width: 338, height: 204 },
  { top: 374, left: 11, width: 338, height: 204 },
  { top: 228, left: 371, width: 338, height: 204 },
];

interface CompositeImage {
  images: Image[];
  frameSrc: string;
}

const CompositeImage = ({ images, frameSrc }: CompositeImage) => {
  return (
    <div className="relative w-[720px] h-[590px]">
      {images.map((img, idx) => {
        const { top, left, width, height } = SLOT_POSITIONS[idx];
        return (
          <img
            key={img.slotIndex}
            src={img.photoImageUrl}
            alt={`photo-${idx}`}
            style={{
              position: "absolute",
              top,
              left,
              width,
              height,
              objectFit: "cover",
            }}
          />
        );
      })}
      <img
        src={frameSrc}
        alt="frame"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default CompositeImage;

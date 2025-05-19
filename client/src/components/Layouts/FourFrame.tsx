import type { Ref } from "react";
import logo from "../../assets/logo.png";

export interface FramePhoto {
  slotIndex: number;
  photoImageUrl: string;
}

interface FrameProps {
  photos: FramePhoto[];
  captureRef?: Ref<HTMLDivElement>;
}

const FourFrame: React.FC<FrameProps> = ({ photos, captureRef }) => {
  // slotIndex를 기준으로 정렬 (혹시 순서가 뒤죽박죽일 수 있으므로)
  const sortedPhotos = photos.sort((a, b) => a.slotIndex - b.slotIndex);

  return (
    <div ref={captureRef} className="relative h-full w-full">
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{ aspectRatio: "1 / 3", height: "100%" }}
      >
        <div className="bg-white w-full h-full flex flex-col gap-[1%] p-[5%] items-center">
          {sortedPhotos.map(({ slotIndex, photoImageUrl }) => (
            <div
              key={slotIndex}
              className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-200"
            >
              <img
                src={photoImageUrl + "?" + new Date().getTime()}
                alt={`slot-${slotIndex}`}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <img src={logo} className="w-1/4" alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default FourFrame;

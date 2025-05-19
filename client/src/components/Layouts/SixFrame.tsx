import type { Ref } from "react";
import none from "../../assets/frames/none.jpg";
import logo from "../../assets/logo.png";

export interface FramePhoto {
  slotIndex: number;
  photoImageUrl?: string;
}

interface FrameProps {
  photos: FramePhoto[];
  captureRef?: Ref<HTMLDivElement>;
}

const SixFrame: React.FC<FrameProps> = ({ photos, captureRef }) => {
  const sortedPhotos = photos.sort((a, b) => a.slotIndex - b.slotIndex);

  return (
    <div ref={captureRef} className="relative h-full w-full">
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{ aspectRatio: "2 / 3", height: "100%" }}
      >
        <div className="bg-white w-full h-full flex flex-col gap-[3%] p-[5%] items-center">
          <div className="w-full h-full flex flex-row gap-[2%] justify-center items-center overflow-hidden">
            <div className="w-full h-full flex flex-col gap-[2%] justify-center items-center overflow-hidden">
              {sortedPhotos.slice(0, 3).map(({ slotIndex, photoImageUrl }) => (
                <div
                  key={slotIndex}
                  className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-200"
                >
                  <img
                    src={
                      photoImageUrl
                        ? photoImageUrl + "?" + new Date().getTime()
                        : none
                    }
                    alt={`slot-${slotIndex}`}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="w-full h-full flex flex-col gap-[2%] justify-center items-center overflow-hidden">
              {sortedPhotos.slice(0, 3).map(({ slotIndex, photoImageUrl }) => (
                <div
                  key={slotIndex}
                  className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-200"
                >
                  <img
                    src={
                      photoImageUrl
                        ? photoImageUrl + "?" + new Date().getTime()
                        : none
                    }
                    alt={`slot-${slotIndex}`}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <img src={logo} className="w-1/8" alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default SixFrame;

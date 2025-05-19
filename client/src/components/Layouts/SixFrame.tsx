import type { Ref } from "react";
import none from "../../assets/frames/none.jpg";
import logo from "../../assets/logo.png";

export interface FramePhoto {
  slotIndex: number;
  url: string;
  memberId?: number;
  nickname?: string;
  profileImageUrl?: string;
  color?: string;
}

interface FrameProps {
  photos: FramePhoto[];
  captureRef?: Ref<HTMLDivElement>;
  onClick?: (slotIndex: number) => void;
}

const SixFrame: React.FC<FrameProps> = ({ photos, captureRef, onClick }) => {
  const fullSlots = Array.from({ length: 6 }, (_, i) => {
    const slot = photos.find((p) => p.slotIndex === i);
    return {
      slotIndex: i,
      url: slot?.url ?? "",
      memberId: slot?.memberId ?? 0,
      nickname: slot?.nickname ?? "",
      profileImageUrl: slot?.profileImageUrl ?? "",
      color: slot?.color ?? "",
    };
  });

  return (
    <div ref={captureRef} className="relative h-full w-full">
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{ aspectRatio: "2 / 3", height: "100%" }}
      >
        <div className="bg-white w-full h-full flex flex-col gap-[3%] p-[5%] items-center">
          <div className="w-full h-full flex flex-row gap-[3%] justify-center items-center overflow-hidden">
            <div className="w-full h-full flex flex-col gap-[2%] justify-center items-center overflow-hidden">
              {fullSlots
                .slice(0, 3)
                .map(({ slotIndex, url, profileImageUrl, color }) => (
                  <div
                    key={slotIndex}
                    onClick={() => onClick?.(slotIndex)}
                    className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gray-200"
                    style={{
                      borderWidth: color ? "2px" : "0px",
                      borderColor: color || "transparent",
                    }}
                  >
                    <img
                      src={url ? url + "?" + new Date().getTime() : none}
                      alt={`slot-${slotIndex}`}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                    {profileImageUrl && (
                      <img
                        src={photos[slotIndex].profileImageUrl}
                        className="w-8 h-8 absolute top-0 right-0"
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="w-full h-full flex flex-col gap-[2%] justify-center items-center overflow-hidden">
              {fullSlots
                .slice(3, 6)
                .map(({ slotIndex, url, profileImageUrl, color }) => (
                  <div
                    key={slotIndex}
                    onClick={() => onClick?.(slotIndex)}
                    className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gray-200"
                    style={{
                      borderWidth: color ? "2px" : "0px",
                      borderColor: color || "transparent",
                    }}
                  >
                    <img
                      src={url ? url + "?" + new Date().getTime() : none}
                      alt={`slot-${slotIndex}`}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                    {profileImageUrl && (
                      <img
                        src={photos[slotIndex].profileImageUrl}
                        className="w-8 h-8 absolute top-0 right-0"
                      />
                    )}
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

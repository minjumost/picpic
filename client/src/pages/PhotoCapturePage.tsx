import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSessionCode } from "../hooks/useSessionCode";
import { sendPhotoStart } from "../sockets/sessionSocket";
import { setHandlers } from "../sockets/stompClient";

const SLOT_COUNT = 4;

interface SlotInfo {
  memberId?: number;
  nickname?: string;
  color?: string;
  profileImageUrl?: string;
  url?: string;
  isOccupied?: boolean;
}

interface PhotoInfo {
  slotIndex: number;
  url: string;
}

const PhotoCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const sessionCode = useSessionCode();
  const sessionId = Number(sessionStorage.getItem("sessionId"));

  const [slots, setSlots] = useState<SlotInfo[]>(() =>
    Array.from({ length: SLOT_COUNT }, () => ({}))
  );

  useEffect(() => {
    console.log("setHandlers 등록됨, sessionCode:", sessionCode);
    setHandlers({
      photo_start: (data) => {
        const slotIdx = Number(data.slotIndex);
        console.log("[photo_start] data:", data, "slotIdx:", slotIdx);
        if (isNaN(slotIdx) || slotIdx < 1 || slotIdx > SLOT_COUNT) return;
        setSlots((prev) => {
          const updated = [...prev];
          updated[slotIdx - 1] = {
            ...updated[slotIdx - 1],
            memberId: data.memberId,
            nickname: data.nickname,
            color: data.color,
            profileImageUrl: data.profileImageUrl,
            isOccupied: true,
          };
          console.log("[photo_start] updated slots:", updated);
          return updated;
        });
      },
      photo_upload: (data: { type: string; photoList: PhotoInfo[] }) => {
        console.log("[photo_upload] data:", data.photoList);
        console.log(data.type);
        if (!data.photoList || !Array.isArray(data.photoList)) return;
        setSlots((prev) => {
          const newSlots = [...prev];
          data.photoList.forEach((photo) => {
            const slotIdx = Number(photo.slotIndex - 1);
            if (!isNaN(slotIdx) && slotIdx >= 0 && slotIdx < SLOT_COUNT) {
              newSlots[slotIdx] = {
                ...newSlots[slotIdx],
                url: photo.url,
                isOccupied: false,
              };
            }
          });
          console.log("[photo_upload] updated slots:", newSlots);
          return newSlots;
        });
      },
    });
  }, []);

  const handleSlotClick = (i: number) => {
    console.log(
      "[handleSlotClick] slot:",
      i,
      "isOccupied:",
      slots[i - 1].isOccupied
    );
    if (slots[i - 1].isOccupied) {
      console.log("[handleSlotClick] slot is occupied, cannot click");
      return;
    }

    console.log("[handleSlotClick] sending photo_start for slot:", i);
    sendPhotoStart(sessionId, sessionCode, i);
    console.log("[handleSlotClick] Navigating to camera page!");
    navigate(`/camera?r=${sessionCode}&slot=${i}`);
  };

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2">사진을 찍어주세요</h2>
      <p className="text-body1 font-bold text-gray-500 mb-6">
        원하는 칸에 들어가 사진을 찍을 수 있어요. 다시 찍기도 가능해요.
      </p>

      <div className="w-full h-full bg-gray-600 p-4 grid grid-cols-2 gap-4">
        {Array(SLOT_COUNT)
          .fill(0)
          .map((_, i) => {
            return (
              <div
                key={i}
                className={`bg-white w-full h-full rounded-sm shadow-inner flex items-center justify-center border-4 ${
                  slots[i].color ? "" : "border-transparent"
                } ${
                  slots[i].isOccupied
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                style={slots[i].color ? { borderColor: slots[i].color } : {}}
                onClick={() => handleSlotClick(i + 1)}
              >
                {slots[i].url ? (
                  <img
                    src={slots[i].url}
                    alt="uploaded"
                    className="object-cover w-full h-full rounded-sm"
                    style={{ transform: "scaleX(-1)" }}
                  />
                ) : slots[i].profileImageUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={slots[i].profileImageUrl}
                      alt={`profile-${i + 1}`}
                      className="object-cover w-20 h-20 rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      {slots[i].nickname}님이 찍는 중...
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          navigate(`/guide?r=${sessionCode}`);
        }}
      >
        꾸미러 가기
      </button>
    </div>
  );
};

export default PhotoCapturePage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import MainLayout from "../components/Layouts/MainLayout";
import { useSessionCode } from "../hooks/useSessionCode";
import { sendDrawReady, sendPhotoStart } from "../sockets/sessionSocket";
import { setHandlers } from "../sockets/stompClient";
import { useFrameStore } from "../store/store";
import { usePageExitEvent } from "../hooks/usePageExitEvent";

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
  usePageExitEvent("PhotoCapturePage");
  const navigate = useNavigate();
  const sessionCode = useSessionCode();
  const sessionId = Number(sessionStorage.getItem("sessionId"));
  const selectedFrame = useFrameStore((state) => state.selectedFrame);
  const SLOT_COUNT = selectedFrame === "six" ? 6 : 4;

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
      stroke_ready: () =>
        navigate(`/preview?r=${sessionCode}`, { replace: true }),
    });
  }, [SLOT_COUNT]);

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
    navigate(`/camera?r=${sessionCode}&slot=${i}`, { replace: true });
  };

  return (
    <MainLayout
      title="사진을 촬영해주세요"
      description={[
        "원하는 칸에 들어가 사진을 찍어주세요",
        "동시에 들어갈 수 없어요",
      ]}
      footer={
        <Button
          label={
            !slots.every((slot) => !!slot.url)
              ? "사진을 전부 촬영해주세요"
              : "촬영 완료"
          }
          onClick={() => {
            sendDrawReady(sessionId, sessionCode);
            navigate(`/preview?r=${sessionCode}`, { replace: true });
          }}
          disabled={!slots.every((slot) => !!slot.url)}
        />
      }
    >
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
                    className="object-cover w-full h-full rounded-sm -scale-x-100"
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
    </MainLayout>
  );
};

export default PhotoCapturePage;

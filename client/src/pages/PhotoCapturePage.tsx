import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGetSelectedFrames } from "../api/frame";
import Button from "../components/Button";
import FourFrame from "../components/Layouts/FourFrame";
import MainLayout from "../components/Layouts/MainLayout";
import SixFrame from "../components/Layouts/SixFrame";
import { useSessionCode } from "../hooks/useSessionCode";
import { sendDrawReady, sendPhotoStart } from "../sockets/sessionSocket";
import { setHandlers } from "../sockets/stompClient";
import { useFrameStore } from "../store/store";

interface SlotInfo {
  slotIndex: number;
  url: string;
  memberId: number;
  nickname: string;
  color: string;
  profileImageUrl: string;
}

interface PhotoInfo {
  slotIndex: number;
  url: string;
}

const PhotoCapturePage: React.FC = () => {
  const navigate = useNavigate();

  const sessionId = Number(sessionStorage.getItem("sessionId"));
  const sessionCode = useSessionCode();
  const { data: sessionFrame } = useGetSelectedFrames(sessionId);
  const isOwner = Number(sessionStorage.getItem("isOwner"));
  const expectedSlotCount = sessionFrame?.frameId === 1 ? 4 : 6;
  const frameStore = useFrameStore();

  const [slots, setSlots] = useState<SlotInfo[]>(
    Array.from({ length: 6 }, (_, i) => ({
      slotIndex: i,
      memberId: 0,
      nickname: "",
      color: "",
      profileImageUrl: "",
      url: "",
    }))
  );

  const allPhotosUploaded =
    sessionFrame != null &&
    slots.filter((slot) => !!slot.url).length === expectedSlotCount;

  const handleSlotClick = (slotIndex: number) => {
    const slot = slots[slotIndex];
    if (slot.memberId || slot.url) {
      return;
    }
    sendPhotoStart(sessionId, sessionCode, slotIndex);
    navigate(`/camera?r=${sessionCode}&slot=${slotIndex}`, { replace: true });
  };

  const handlePhotoStart = (data: SlotInfo & { slotIndex: number }) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[data.slotIndex] = {
        slotIndex: data.slotIndex,
        url: "",
        memberId: data.memberId,
        nickname: data.nickname,
        color: data.color,
        profileImageUrl: data.profileImageUrl,
      };
      return updated;
    });
  };

  const handlePhotoUpload = (data: {
    type: string;
    photoList: PhotoInfo[];
  }) => {
    setSlots((prev) => {
      const updated = [...prev];
      data.photoList.forEach(({ slotIndex, url }) => {
        updated[slotIndex] = {
          slotIndex,
          url,
          memberId: 0,
          nickname: "",
          color: "",
          profileImageUrl: "",
        };
      });
      return updated;
    });
  };

  const handleDrawReady = () => {
    navigate(`/preview?r=${sessionCode}`, { replace: true });
  };

  useEffect(() => {
    setHandlers({
      photo_start: handlePhotoStart,
      photo_upload: handlePhotoUpload,
      stroke_ready: handleDrawReady,
    });
  }, []);

  useEffect(() => {
    if (sessionFrame?.frameId) {
      frameStore.setSelectedFrame(sessionFrame?.frameId === 1 ? "four" : "six");
    }
  }, [sessionFrame]);

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
            !allPhotosUploaded
              ? "사진을 전부 촬영해주세요"
              : isOwner
              ? "촬영 완료"
              : "방장이 진행할 수 있습니다"
          }
          onClick={() => {
            sendDrawReady(sessionId, sessionCode);
            navigate(`/preview?r=${sessionCode}`, { replace: true });
          }}
          disabled={!allPhotosUploaded || !isOwner}
        />
      }
    >
      {sessionFrame?.frameId === 1 && (
        <FourFrame photos={slots} onClick={handleSlotClick}></FourFrame>
      )}
      {sessionFrame?.frameId === 2 && (
        <SixFrame photos={slots} onClick={handleSlotClick}></SixFrame>
      )}
    </MainLayout>
  );
};

export default PhotoCapturePage;

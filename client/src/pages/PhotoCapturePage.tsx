import React, { useEffect, useRef, useState } from "react";
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
}

const PhotoCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const sessionCode = useSessionCode();
  const sessionId = Number(sessionStorage.getItem("sessionId"));

  // slot별 상태 관리
  const [slots, setSlots] = useState<SlotInfo[]>(Array(SLOT_COUNT).fill({}));
  const pendingSlot = useRef<number | null>(null);

  useEffect(() => {
    console.log("setHandlers 등록됨, sessionCode:", sessionCode);
    setHandlers({
      photo_start: (data) => {
        console.log("photo_start received:", data);
        setSlots((prev) => {
          const updated = [...prev];
          updated[data.slot_index - 1] = {
            memberId: data.memberId,
            nickname: data.nickname,
            color: data.color,
            profileImageUrl: data.profilImageUrl,
            url: undefined,
          };
          return updated;
        });
        console.log(
          "pendingSlot.current:",
          pendingSlot.current,
          "data.slot_index:",
          data.slot_index
        );
      },
      photo_upload: (data) => {
        setSlots((prev) => {
          const updated = [...prev];
          updated[data.slot_index - 1] = {
            url: data.url,
          };
          console.log("updated:", updated);
          console.log("data.url:", data.url);
          return updated;
        });
      },
    });
    // cleanup: 핸들러 초기화(필요시)
    return () => {
      console.log("setHandlers 해제");
      setHandlers({});
    };
  }, []);

  const handleSlotClick = (i: number) => {
    pendingSlot.current = i;
    console.log("handleSlotClick: pendingSlot.current set to", i);
    // 요청이 잘 와졌을 경우에 이동하도록 구현하려면
    sendPhotoStart(sessionId, sessionCode, i);

    console.log("Navigating to camera page!");
    navigate(`/camera?r=${sessionCode}&slot=${i}`);
    pendingSlot.current = null;
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
          .map((_, i) => (
            <div
              key={i}
              className={`bg-white w-full h-full rounded-sm shadow-inner cursor-pointer flex items-center justify-center border-4 ${
                slots[i].color ? "" : "border-transparent"
              }`}
              style={slots[i].color ? { borderColor: slots[i].color } : {}}
              onClick={() => handleSlotClick(i + 1)} // slot_index: 1~4
            >
              {slots[i].url ? (
                <img
                  src={slots[i].url}
                  alt="uploaded"
                  className="object-cover w-full h-full rounded-sm"
                />
              ) : slots[i].profileImageUrl ? (
                <img
                  src={slots[i].profileImageUrl}
                  alt={`profile-${i + 1}`}
                  className="object-cover w-20 h-20 rounded-full"
                />
              ) : null}
            </div>
          ))}
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

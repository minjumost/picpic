import { useState } from "react";
import checkIcon from "../../assets/check.png"; // ✅ 체크 아이콘
import { PlacedObject } from "../../types/object";
import { useObjectStore } from "../../store/objectStore";
import { sendRemoveObjectMessage } from "../Grid/utils";
import { Client } from "@stomp/stompjs";

interface TopSheetProps {
  stompClient: Client | null;
  code: string;
  objects: PlacedObject[];
  onClose: () => void;
}

function TopSheet({ stompClient, code, objects, onClose }: TopSheetProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { removePlacedObjectById } = useObjectStore();

  // 오브젝트가 없으면 렌더링하지 않음
  if (objects.length === 0) return null;

  const handleClick = (index: number) => {
    if (selectedIndex === index) {
      const objectToDelete = objects[index];
      console.log(objectToDelete);
      removePlacedObjectById(objectToDelete.id);
      sendRemoveObjectMessage({
        client: stompClient,
        code,
        object: objectToDelete,
      });
      setSelectedIndex(null);
    }

    if (objects.length === 0) {
      onClose();
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="absolute top-0 z-10 mx-auto w-full p-2 flex flex-col items-start gap-2 bg-orange border-[3px] border-blackBorder rounded-lg">
      <div className="relative w-full flex flex-wrap justify-center items-center gap-4 p-5 bg-yellowBorder border-[3px] border-orangeBorder rounded-lg box-border">
        {objects.map((object, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="relative flex justify-center items-center min-w-[50px] min-h-[50px] p-1 cursor-pointer"
          >
            {/* 체크 아이콘 (좌상단) */}
            {selectedIndex === index && (
              <img
                src={checkIcon}
                alt="Selected"
                className="absolute -top-1 -left-1 w-[20px] h-[20px]"
              />
            )}
            <img
              src={object.imageUrl}
              alt={`Object ${index}`}
              className="block max-w-[50px] max-h-[50px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopSheet;

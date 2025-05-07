// BottomSheet.tsx

import { useState } from "react";
import { useObjectStore } from "../../store/objectStore";
import { useQuery } from "@tanstack/react-query";
import { getObjects, ObjectResponse } from "../../api/getObejects";
import { mockup } from "../../mocks/item";
import { BaseObject } from "../../types/object";

const CATEGORY_TYPES = ["tiles", "objects", "walls"] as const;
type Category = (typeof CATEGORY_TYPES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  tiles: "타일",
  objects: "소품",
  walls: "벽지",
};

const BottomSheet = () => {
  const { data, isLoading, error } = useQuery<ObjectResponse>({
    queryKey: ["getObjects"],
    queryFn: getObjects,
  });

  const { selectedObject, setSelectedObject } = useObjectStore();

  const [index, setIndex] = useState(0);
  const currentCategory = CATEGORY_TYPES[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % CATEGORY_TYPES.length);
  };

  const handlePrev = () => {
    setIndex(
      (prev) => (prev - 1 + CATEGORY_TYPES.length) % CATEGORY_TYPES.length
    );
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error || !data) return <div>데이터를 불러올 수 없습니다.</div>;

  const items = mockup[currentCategory];

  const handleItemClick = (item: BaseObject) => {
    if (selectedObject?.id === item.id) {
      setSelectedObject(null);
      return;
    }
    setSelectedObject({
      ...item,
    });
  };

  return (
    <div className="absolute left-0 bottom-0 z-10 w-full h-[320px] bg-orange border-[3px] border-blackBorder rounded-lg p-2 flex flex-col gap-2">
      <div className="flex justify-center items-center border-[3px] border-orangeBorder rounded-lg h-[45px] w-full gap-4 px-6">
        <button onClick={handlePrev} className="text-blackBorder text-2xl">
          &lt;
        </button>
        <span className="text-blackBorder text-subtitle">
          {CATEGORY_LABELS[currentCategory]}
        </span>
        <button onClick={handleNext} className="text-blackBorder text-2xl">
          &gt;
        </button>
      </div>

      <div className="flex flex-wrap justify-center content-start gap-5 p-3 bg-yellowBorder border-[3px] border-orangeBorder rounded-lg w-full h-[251px] overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`flex justify-center items-center cursor-pointer p-1 
              ${
                selectedObject?.id === item.id
                  ? "rounded-lg border-2 border-red-500"
                  : ""
              }`}
          >
            <img
              src={item.imageUrl}
              alt={`item-${index}`}
              className="block max-w-[60px] max-h-[60px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomSheet;

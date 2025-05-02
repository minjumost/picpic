// BottomSheet.tsx

import { useEffect, useState } from "react";
import { useObjectStore } from "../../store/objectStore";
import { useQuery } from "@tanstack/react-query";
import { BaseObject, getObjects } from "../../api/getObejects";
import { tiles } from "../../mocks/item";

// 새로운 타입 정의
export interface ServerItem {
  id: number;
  type: number;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

// 카테고리 타입 상수
const OBJECT_TYPES = {
  TILE: 0,
  OBJECT: 1,
  WALL: 2,
} as const;

const OBJECT_TYPE_LABELS = {
  [OBJECT_TYPES.TILE]: "타일",
  [OBJECT_TYPES.OBJECT]: "가구",
  [OBJECT_TYPES.WALL]: "벽지",
} as const;

// 카테고리 정의
const CATEGORIES = [
  { key: OBJECT_TYPES.TILE, label: OBJECT_TYPE_LABELS[OBJECT_TYPES.TILE] },
  { key: OBJECT_TYPES.OBJECT, label: OBJECT_TYPE_LABELS[OBJECT_TYPES.OBJECT] },
  { key: OBJECT_TYPES.WALL, label: OBJECT_TYPE_LABELS[OBJECT_TYPES.WALL] },
] as const;

const BottomSheet = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getObjects"],
    queryFn: getObjects,
  });

  const { setSelectedObject } = useObjectStore();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<
    Record<number, BaseObject[]>
  >({
    [OBJECT_TYPES.TILE]: [],
    [OBJECT_TYPES.OBJECT]: [],
    [OBJECT_TYPES.WALL]: [],
  });

  useEffect(() => {
    if (!data) return;

    console.log(data);
    const categorizedItems = {
      [OBJECT_TYPES.TILE]: data.tiles,
      [OBJECT_TYPES.OBJECT]: data.objects,
      [OBJECT_TYPES.WALL]: data.walls,
    };

    setCategoryItems(categorizedItems);
  }, [data]);

  const handlePrev = () => {
    setCurrentCategoryIndex((prev) =>
      prev === 0 ? CATEGORIES.length - 1 : prev - 1
    );
    setSelectedIndex(null);
  };

  const handleNext = () => {
    setCurrentCategoryIndex((prev) =>
      prev === CATEGORIES.length - 1 ? 0 : prev + 1
    );
    setSelectedIndex(null);
  };

  const currentCategory = CATEGORIES[currentCategoryIndex];
  const items = categoryItems[currentCategory.key] || [];

  const handleItemClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setSelectedObject(null);
      return;
    }

    setSelectedIndex(index);
    const clickedItem = items[index];
    setSelectedObject({
      ...clickedItem,
      src: clickedItem.imageUrl, // imageUrl을 src로 매핑
      type: currentCategory.key,
    });
  };

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;

  return (
    <div className="absolute left-0 bottom-0 z-10 w-full h-[320px] bg-orange border-[3px] border-blackBorder rounded-lg p-2 flex flex-col gap-2">
      <div className="flex justify-center items-center border-[3px] border-orangeBorder rounded-lg h-[45px] w-full gap-4 px-6">
        <button onClick={handlePrev} className="text-blackBorder text-2xl">
          {"<"}
        </button>
        <span className="text-blackBorder text-subtitle">
          {currentCategory.label}
        </span>
        <button onClick={handleNext} className="text-blackBorder text-2xl">
          {">"}
        </button>
      </div>

      <div className="flex flex-wrap justify-center content-start gap-5 p-3 bg-yellowBorder border-[3px] border-orangeBorder rounded-lg w-full h-[251px] overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(index)}
            className={`flex justify-center items-center cursor-pointer p-1 
              ${
                selectedIndex === index
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

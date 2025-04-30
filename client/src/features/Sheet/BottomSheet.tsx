// BottomSheet.tsx

import { useState } from "react";
import { furnitures, tiles, walls } from "../../mocks/item";
import { useObjectStore } from "../../store/objectStore";
import { ServerObject, CATEGORIES, CategoryKey } from "../../types/object"; // ✨ types import

const categories = CATEGORIES; // ✨ 중앙 관리된 카테고리 사용

const categoryItems: Record<CategoryKey, ServerObject[]> = {
  furniture: furnitures,
  tile: tiles,
  wall: walls,
};

const BottomSheet = () => {
  const { setSelectedObject } = useObjectStore();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setCurrentCategoryIndex((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
    setSelectedIndex(null);
  };

  const handleNext = () => {
    setCurrentCategoryIndex((prev) =>
      prev === categories.length - 1 ? 0 : prev + 1
    );
    setSelectedIndex(null);
  };

  const currentCategory = categories[currentCategoryIndex];
  const items = categoryItems[currentCategory.key] || [];

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
    const clickedItem = items[index]; // ServerObject 전체 넘김
    setSelectedObject(clickedItem);
  };

  return (
    <div className="absolute left-0 bottom-0 z-10 w-full h-[320px] bg-orange border-[3px] border-blackBorder rounded-lg p-2 flex flex-col gap-2">
      {/* 카테고리 헤더 */}
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

      {/* 아이템 리스트 */}
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
              src={item.src}
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

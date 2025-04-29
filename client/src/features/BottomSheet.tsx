import { useState } from "react";
import furnitureImage from "../assets/furnitures/test_furniture.png";
import tileImage from "../assets/tiles/test_tile.png";

interface CategoryItems {
  [category: string]: string[];
}

const categories: string[] = ["가구", "타일", "벽"];

const categoryItems: CategoryItems = {
  가구: Array(12).fill(furnitureImage),
  타일: Array(12).fill(tileImage),
  벽: Array(12).fill(tileImage),
};

const BottomSheet = () => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
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

  const currentCategory: string = categories[currentCategoryIndex];
  const items: string[] = categoryItems[currentCategory];

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div>
      <div className="w-full h-[320px] bg-orange border-[3px] border-blackBorder rounded-lg p-2 flex flex-col gap-2">
        {/* 카테고리 헤더 */}
        <div className="flex justify-center items-center border-[3px] border-orangeBorder rounded-lg h-[45px] w-full gap-4 px-6">
          <button onClick={handlePrev} className="text-blackBorder text-2xl">
            {"<"}
          </button>
          <span className="text-blackBorder text-subtitle">
            {currentCategory}
          </span>
          <button onClick={handleNext} className="text-blackBorder text-2xl">
            {">"}
          </button>
        </div>

        {/* 아이템 리스트 */}
        <div className="flex flex-wrap justify-center content-start gap-5 p-3 bg-yellowBorder border-[3px] border-orangeBorder rounded-lg w-full h-[251px] overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(index)}
              className={`flex justify-center items-center cursor-pointer p-1 
                ${
                  selectedIndex === index
                    ? "rounded-lg border-2 border-red-500"
                    : ""
                }`}
            >
              <img
                src={item}
                alt={`item-${index}`}
                className="block max-w-[60px] max-h-[60px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;

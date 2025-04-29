import { useState } from "react";
import woodTile from "../assets/tiles/test_tile.png";
import table from "../assets/furnitures/test_furniture.png";
import furniture from "../assets/furnitures/test_furniture2.png";
import checkIcon from "../assets/check.png"; // ✅ 체크 아이콘

// 타입 정의
interface AssetItem {
  src: string;
  alt: string;
}

const assets: AssetItem[] = [
  { src: woodTile, alt: "Wood Tile" },
  { src: table, alt: "Table" },
  { src: furniture, alt: "Printer" },
];

function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="mx-auto w-full p-2 flex flex-col items-start gap-2 bg-orange border-[3px] border-blackBorder rounded-lg">
      <div className="relative w-full flex flex-wrap justify-center items-center gap-4 p-5 bg-yellowBorder border-[3px] border-orangeBorder rounded-lg box-border">
        {assets.map((asset, index) => (
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
              src={asset.src}
              alt={asset.alt}
              className="block max-w-[50px] max-h-[50px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

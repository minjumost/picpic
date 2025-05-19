import logo from "../../assets/logo.png";

const SixFrame = () => {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{ aspectRatio: "2 / 3", height: "100%" }}
      >
        <div className="bg-white w-full h-full flex flex-row gap-2 p-3 items-end">
          <div className="w-full h-full flex flex-col gap-4 items-center">
            <div className="w-full h-full flex flex-row gap-3">
              <div className="w-full h-full flex flex-col gap-3 items-center">
                <div className="bg-gray-500 w-full h-full"></div>
                <div className="bg-gray-500 w-full h-full"></div>
                <div className="bg-gray-500 w-full h-full"></div>
              </div>
              <div className="w-full h-full flex flex-col gap-3 items-center">
                <div className="bg-gray-500 w-full h-full"></div>
                <div className="bg-gray-500 w-full h-full"></div>
                <div className="bg-gray-500 w-full h-full"></div>
              </div>
            </div>
            <img src={logo} className="w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SixFrame;

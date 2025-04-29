import BottomSheet from "../features/Sheet/BottomSheet";
import Grid from "../features/Grid/Grid";
import TopSheet from "../features/Sheet/TopSheet";

const MainPage = () => {
  return (
    <div className="bg-bg relative h-full flex flex-col items-center justify-center">
      <TopSheet />
      <BottomSheet />
      <Grid />
    </div>
  );
};

export default MainPage;

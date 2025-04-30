import BottomSheet from "../features/Sheet/BottomSheet";
import Grid from "../features/Grid/Grid";

const MainPage = () => {
  return (
    <div className="bg-bg relative h-full flex flex-col items-center justify-center">
      <BottomSheet />
      <Grid />
    </div>
  );
};

export default MainPage;

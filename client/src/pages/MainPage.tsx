import { useSearchParams } from "react-router-dom";
import BottomSheet from "../features/Sheet/BottomSheet";
import Grid from "../features/Grid/Grid";
import { useStomp } from "../hooks/useStomp";

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("r");

  useStomp(roomCode);

  return (
    <div className="bg-bg relative h-full flex flex-col items-center justify-center">
      <BottomSheet />
      <Grid />
    </div>
  );
};

export default MainPage;

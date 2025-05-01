import { useSearchParams } from "react-router-dom";
import BottomSheet from "../features/Sheet/BottomSheet";
import Grid from "../features/Grid/Grid";
import { useStomp } from "../hooks/useStomp";
import { useState } from "react";
import { StompMessage } from "../types/stomp";

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("r");
  const [stompMessage, setStompMessage] = useState<StompMessage | null>(null);

  useStomp(roomCode, setStompMessage);

  return (
    <div className="bg-bg relative h-full flex flex-col items-center justify-center">
      <BottomSheet />
      {roomCode && <Grid code={roomCode} stompMessage={stompMessage} />}
    </div>
  );
};

export default MainPage;

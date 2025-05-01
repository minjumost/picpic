import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BottomSheet from "../features/Sheet/BottomSheet";
import Grid from "../features/Grid/Grid";
import { useStomp } from "../hooks/useStomp";
import { StompMessage } from "../types/stomp";

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("r");
  const [stompMessage, setStompMessage] = useState<StompMessage | null>(null);

  const clientRef = useStomp(roomCode, setStompMessage);

  return (
    <div className="bg-bg relative h-full flex flex-col items-center justify-center">
      <BottomSheet />
      {roomCode && (
        <Grid
          code={roomCode}
          stompMessage={stompMessage}
          stompClient={clientRef.current}
        />
      )}
    </div>
  );
};

export default MainPage;

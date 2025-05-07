import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BottomSheet from "../features/Sheet/BottomSheet";
import Grid from "../features/Grid/Grid";
import { useStomp } from "../hooks/useStomp";
import { StompMessage } from "../types/stomp";
import { trackRoomEnter, trackRoomExit } from "../utils/analytics";
import GA4Initializer from "../GA4Initializer";

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("r");
  const [stompMessage, setStompMessage] = useState<StompMessage | null>(null);

  const stompClient = useStomp(roomCode, setStompMessage);

  useEffect(() => {
    if (roomCode) {
      trackRoomEnter(roomCode);
    }

    return () => {
      if (roomCode) {
        trackRoomExit(roomCode);
      }
    };
  }, [roomCode]);

  if (!roomCode || !stompClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GA4Initializer />
      <div className="bg-bg relative h-full flex flex-col items-center justify-center">
        <BottomSheet />
        {roomCode && (
          <Grid
            code={roomCode}
            stompMessage={stompMessage}
            stompClient={stompClient}
          />
        )}
      </div>
    </>
  );
};

export default MainPage;

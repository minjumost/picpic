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

  const stompClient = useStomp(roomCode, setStompMessage);

  // if (!roomCode || !stompClient) {
  //   return <div>Loading...</div>; // 또는 적절한 로딩 상태 표시
  // }

  return (
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
  );
};

export default MainPage;

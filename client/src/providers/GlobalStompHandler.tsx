import { useEffect } from "react";
import { setHandlers } from "../sockets/stompClient";
import { useSessionCode } from "../hooks/useSessionCode";
import { useNavigate } from "react-router";

const GlobalStompHandler = () => {
  const navigate = useNavigate();
  const sessionCode = useSessionCode();

  useEffect(() => {
    const isOwner = sessionStorage.getItem("isOwner");
    if (isOwner !== "0") return;

    if (!sessionCode) return;

    setHandlers({
      session_start: () => {
        navigate(`/photo?r=${sessionCode}`);
      },
      stroke_start: () => {
        navigate(`/decorate?r=${sessionCode}`);
      },
      collage_start: () => {
        navigate(`/final?r=${sessionCode}`);
      },
    });
  }, [navigate, sessionCode]);

  return null;
};

export default GlobalStompHandler;

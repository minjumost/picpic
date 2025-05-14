import { useEffect } from "react";
import { addHandlers } from "../sockets/stompClient";
import { Outlet, useLocation, useNavigate } from "react-router";

const GlobalStompHandler = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sessionCode = new URLSearchParams(search).get("r");
  const isOwner = sessionStorage.getItem("isOwner");

  console.log("isOwner: ", isOwner);
  console.log("sessionCode: ", sessionCode);

  useEffect(() => {
    if (isOwner !== "0" || !sessionCode) return;

    addHandlers({
      session_start: () => navigate(`/photo?r=${sessionCode}`),
      stroke_start: () => navigate(`/decorate?r=${sessionCode}`),
      collage_start: () => navigate(`/final?r=${sessionCode}`),
    });
  }, [navigate, sessionCode]);

  return <Outlet />;
};

export default GlobalStompHandler;

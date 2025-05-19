import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import stompClient from "../../sockets/stompClient";
import GA4Initializer from "../../GA4Initializer";

const AppLayout = () => {
  const navigate = useNavigate();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    stompClient.deactivate({ force: true });
    sessionStorage.clear();
    navigate("/", { replace: true });
  }, []);

  return (
    <>
      <GA4Initializer />
      <Outlet />
    </>
  );
};

export default AppLayout;

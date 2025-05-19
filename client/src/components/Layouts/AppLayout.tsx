import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import GA4Initializer from "../../GA4Initializer";
import stompClient from "../../sockets/stompClient";

const AppLayout = () => {
  const navigate = useNavigate();
  const didRun = useRef(false);

  useEffect(() => {
    const entries = performance.getEntriesByType("navigation");
    const navEntry = entries[0] as PerformanceNavigationTiming | undefined;

    if (navEntry?.type === "reload") {
      stompClient.deactivate({ force: true });
      sessionStorage.clear();
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <>
      <GA4Initializer />
      <Outlet />
    </>
  );
};

export default AppLayout;

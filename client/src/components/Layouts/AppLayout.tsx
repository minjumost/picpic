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

    const flag = sessionStorage.getItem("firstLoadDone");
    if (flag === null) {
      console.log("첫 로드");
      sessionStorage.setItem("firstLoadDone", "1");
    } else {
      console.log("리로드");
      stompClient.deactivate();
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

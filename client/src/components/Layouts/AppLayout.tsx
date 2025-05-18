import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import stompClient from "../../sockets/stompClient";

const AppLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.sessionStorage.getItem("firstLoadDone") === null) {
      console.log("첫 로드");
      window.sessionStorage.setItem("firstLoadDone", "1");
    } else {
      console.log("리로드");
      stompClient.deactivate();
      window.sessionStorage.clear();
      navigate("/", { replace: true });
    }
  }, []);

  return <Outlet />;
};

export default AppLayout;

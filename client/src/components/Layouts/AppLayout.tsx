// src/layouts/AppLayout.tsx
import { useEffect } from "react";
import { Outlet } from "react-router";
import stompClient from "../../sockets/stompClient";

const AppLayout = () => {
  useEffect(() => {
    const handlePopState = () => {
      const current = window.location.pathname;
      console.log(window.location.pathname);
      if (current === "/") {
        window.location.replace("/");
        return;
      }

      const confirmed = window.confirm("그만하고 나가시겠습니까?");
      if (confirmed) {
        stompClient.deactivate();
        sessionStorage.clear();
        window.location.replace("/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return <Outlet />;
};

export default AppLayout;

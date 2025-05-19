import { useEffect } from "react";
import { sendEvent } from "../utils/analytics";

export function usePageExitEvent(pageName: string) {
  useEffect(() => {
    const handleExit = () => {
      sendEvent("Page", "Exit", pageName);
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, [pageName]);
}

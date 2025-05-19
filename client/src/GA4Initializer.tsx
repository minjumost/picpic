import { useEffect } from "react";
import { initGA, sendPageView } from "./utils/analytics";
import { useLocation } from "react-router-dom";

export default function GA4Initializer() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    sendPageView();
  }, [location]);

  return null;
}

import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-2RH22EZ8NY";

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const sendPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const sendEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({ category, action, label });
};

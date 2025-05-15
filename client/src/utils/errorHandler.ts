import { AxiosError } from "axios";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    switch (status) {
      // case 404:
      //   window.location.href = "/404";
      //   break;
      default:
        console.error("Unexpected error:", error);
        break;
    }
  } else {
    console.error("Unknown error:", error);
  }
};

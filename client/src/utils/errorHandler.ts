import { AxiosError } from "axios";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    switch (status) {
      // case 404:
      //   window.location.href = "/404";
      //   break;
      case 429:
        alert("너무 많은 요청을 보냈어요. 잠시 후 다시 시도해주세요");
        break;
      default:
        console.error("Unexpected error:", error);
        break;
    }
  } else {
    console.error("Unknown error:", error);
  }
};

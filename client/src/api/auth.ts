import { useMutation } from "@tanstack/react-query";
import { client } from "./axios";

const postGuestLogin = async () => {
  const response = await client.post("/api/v1/auth/guest");
  return response.data.result;
};

export const useGuestLogin = () => {
  return useMutation({
    mutationFn: postGuestLogin,
  });
};

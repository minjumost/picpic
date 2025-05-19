import { useMutation } from "@tanstack/react-query";
import { client } from "./axios";

const postGuestLogin = async () => {
  const response = await client.post("/api/v1/auth/guest");
  return response.data.result;
};

const postRoomEnter = async (sessionCode: string, password: string) => {
  const response = await client.put(`/api/v1/session/${sessionCode}`, {
    password: password,
  });
  return response.data.result;
};

export const useGuestLogin = () => {
  return useMutation({
    mutationFn: postGuestLogin,
  });
};

export const useRoomEnter = () => {
  return useMutation({
    mutationFn: (params: { sessionCode: string; password: string }) =>
      postRoomEnter(params.sessionCode, params.password),
  });
};

import axios from "axios";

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

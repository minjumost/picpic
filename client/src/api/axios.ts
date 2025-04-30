import axios from "axios";

export const client = axios.create({
  baseURL: "your_api_base_url", // 실제 API 서버 URL로 변경 필요
  headers: {
    "Content-Type": "application/json",
  },
});

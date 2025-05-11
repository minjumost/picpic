import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

const useHttps =
  fs.existsSync("localhost+2-key.pem") && fs.existsSync("localhost+2.pem");

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@page", replacement: "/src/page" },
    ],
  },
  plugins: [react(), tailwindcss()],
  server: {
    https: useHttps
      ? {
          key: fs.readFileSync("localhost+2-key.pem"),
          cert: fs.readFileSync("localhost+2.pem"),
        }
      : undefined, // 파일이 없으면 HTTPS 사용 안함
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
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
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // 🔥 핵심 포인트
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    https: useHttps
      ? {
          key: fs.readFileSync("localhost+2-key.pem"),
          cert: fs.readFileSync("localhost+2.pem"),
        }
      : undefined, // 파일이 없으면 HTTPS 사용 안함
    proxy: {
      // S3 버킷에 대한 프록시 설정 추가
      "/s3-bucket": {
        target: "https://minipia.s3.ap-northeast-2.amazonaws.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/s3-bucket/, ""),
      },
    },
  },
});

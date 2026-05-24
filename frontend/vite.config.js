import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindCss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(),tailwindCss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});

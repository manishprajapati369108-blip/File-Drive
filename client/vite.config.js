import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000,
    allowedHosts: [
      "kabob-plywood-deflector.ngrok-free.dev",
      ".ngrok-free.dev", // This allows ANY ngrok subdomain (recommended)
    ], // proxy means middle man
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        strictPort: true,
        open: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

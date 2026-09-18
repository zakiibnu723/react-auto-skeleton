import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@zakiibnu723/react-auto-skeleton": path.resolve(__dirname, "../src/index.ts")
    }
  },
  server: {
    port: 3000,
    open: true
  }
});


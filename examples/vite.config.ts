import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: {
      "react-auto-skeleton": path.resolve(__dirname, "../src")
    }
  },
  build: {
    outDir: path.resolve(__dirname, "../dist-examples"),
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});

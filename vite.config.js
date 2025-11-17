import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    transformer: "lightningcss",
  },
  server: {
    allowedHosts: ["jonos-macbook-air.local"],
  },
});

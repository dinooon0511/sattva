import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  base: "./",
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        app: fileURLToPath(new URL("./app.html", import.meta.url)),
      },
    },
  },
});

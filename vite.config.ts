import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {},
  },
  assetsInclude: ["**/*.obj", "**/*.mtl"],
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/@tedengine/ted/assets",
          dest: "./",
        },
      ],
    }),
  ],
});

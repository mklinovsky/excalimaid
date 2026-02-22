import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  test: {
    include: ["cli/**/*.test.ts", "src/**/*.test.ts"],
  },
  build: {
    outDir: "dist/web",
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@excalidraw/excalidraw/dist/prod/fonts",
          dest: ".",
        },
      ],
    }),
  ],
});

// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    {
      name: "generate-redirects",
      hooks: {
        "astro:build:done": async () => {
          await execAsync("node ./scripts/generate-redirects.mjs");
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

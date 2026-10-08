import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// GitHub Pages serves the app from a sub-folder (e.g. /read-espanol-flow/). The deploy
// workflow passes that folder in BASE_PATH; locally (and on a custom domain) it is "/".
function basePath() {
  const raw = (process.env["BASE_PATH"] ?? "").trim().replace(/^\/+|\/+$/g, "");
  return raw ? `/${raw}/` : "/";
}

export default defineConfig({
  base: basePath(),
  plugins: [
    // Must come before the React plugin. Generates src/routeTree.gen.ts from src/routes.
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    react(),
  ],
  css: { transformer: "lightningcss" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: { host: "::", port: 8080 },
});

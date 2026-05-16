/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.config.*",
        "**/*.d.ts",
        "**/types/",
        "scripts/",
      ],
    },
  },
  resolve: {
    alias: {
      "@domain": resolve(__dirname, "./src/domain"),
      "@application": resolve(__dirname, "./src/application"),
      "@infrastructure": resolve(__dirname, "./src/infrastructure"),
      "@presentation": resolve(__dirname, "./src/presentation"),
      "@shared": resolve(__dirname, "./src/shared"),
      "@main": resolve(__dirname, "./src/main"),
      "@data": resolve(__dirname, "./src/data"),
    },
  },
  esbuild: {
    target: "esnext",
  },
});

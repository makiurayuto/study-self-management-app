import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // ルールのテストは Emulator が必要なので npm run test:rules で別に実行する
    exclude: ["node_modules/**", "tests/rules/**"],
  },
});

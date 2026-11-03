import { defineConfig } from "vitest/config";

// Firestore ルールのテスト用（Emulator 上で実行）
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.ts"],
    // 同じ Emulator を使うので直列に実行
    fileParallelism: false,
    testTimeout: 20000,
  },
});

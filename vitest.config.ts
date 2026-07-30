import { defineConfig } from "vite-plus";

// We replicate the relevant JSX parts of the askr() vite plugin inline rather
// than importing it, because the plugin's dist bundles its own Vite copy which
// lacks a package.json and causes ENOENT at startup.
// Vitest v4 uses oxc-transform by default; configure JSX through oxc.
export default defineConfig({
  optimizeDeps: {
    include: ["@askrjs/askr", "@askrjs/askr/jsx-runtime", "@askrjs/askr/jsx-dev-runtime"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/create-icon.tsx"],
      reporter: ["text", "json-summary"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
  oxc: {
    jsx: { runtime: "automatic", importSource: "@askrjs/askr" },
    jsxInject: "import { jsx, jsxs, Fragment } from '@askrjs/askr/jsx-runtime';",
  },
});

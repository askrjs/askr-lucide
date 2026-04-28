import { defineConfig } from "vite-plus";

const externalPackagePattern = /^@askrjs\/(?:askr|askr-ui)(?:\/.*)?$/;

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@askrjs/askr",
  },
  pack: {
    entry: "src/index.ts",
    format: ["esm"],
    outDir: "dist",
    platform: "neutral",
    dts: true,
    sourcemap: true,
    unbundle: true,
    deps: {
      neverBundle: [/^@askrjs\/(?:askr|askr-ui)(?:\/.*)?$/],
    },
  },
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
    },
    rollupOptions: {
      external: (id) => externalPackagePattern.test(id),
      output: [
        {
          dir: "dist",
          entryFileNames: "[name].js",
          exports: "named",
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
        },
      ],
    },
  },
});

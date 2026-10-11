import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite-plus";
import { collectIcons } from "../scripts/generate.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const icons = collectIcons().map(({ name, kebab }) => ({
  name: `${name}Icon`,
  path: `icons/${kebab}`,
}));
const names = icons.map(({ name }) => name).sort();
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
assert.deepEqual(Object.keys(manifest.exports).sort(), [
  ".",
  "./capabilities.json",
  "./icons/*",
  "./package.json",
]);
// The wildcard is limited to the pinned generated catalog, never helper files.
assert.deepEqual(
  readdirSync(join(root, "dist/icons"))
    .filter((file) => file.endsWith(".js"))
    .sort(),
  icons.map(({ path }) => `${path.slice("icons/".length)}.js`).sort(),
);
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, "Run installed contracts through npm");
const runNpm = (args, options) => execFileSync(process.execPath, [npmCli, ...args], options);
const sandbox = mkdtempSync(join(tmpdir(), "askr-lucide-installed-"));
try {
  const packed = JSON.parse(
    runNpm(["pack", "--ignore-scripts", "--json", "--pack-destination", sandbox], {
      cwd: root,
      encoding: "utf8",
    }),
  );
  const { filename } = Array.isArray(packed) ? packed[0] : Object.values(packed)[0];
  const consumer = join(sandbox, "consumer");
  mkdirSync(consumer);
  const floor = /^>=([^ ]+)/.exec(manifest.peerDependencies["@askrjs/askr"])?.[1];
  assert.ok(floor, "The installed contract needs an explicit Askr peer floor");
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({
      name: "lucide-packed-consumer",
      private: true,
      type: "module",
      dependencies: { "@askrjs/lucide": `file:${join(sandbox, filename)}`, "@askrjs/askr": floor },
    }),
  );
  runNpm(["install", "--no-audit", "--no-fund"], {
    cwd: consumer,
    stdio: "pipe",
  });
  writeFileSync(
    join(consumer, "runtime.mjs"),
    `
import assert from "node:assert/strict";
import * as lucide from "@askrjs/lucide";
import { renderToStringSync } from "@askrjs/askr/ssr";
import manifest from "@askrjs/lucide/package.json" with { type: "json" };
import capabilities from "@askrjs/lucide/capabilities.json" with { type: "json" };
const icons = ${JSON.stringify(icons)};
assert.deepEqual(Object.keys(lucide).sort(), ${JSON.stringify(names)});
assert.equal(manifest.name, "@askrjs/lucide");
assert.ok(capabilities && typeof capabilities === "object");
for (const { name, path } of icons) {
  const deep = await import("@askrjs/lucide/" + path);
  assert.deepEqual(Object.keys(deep), [name]);
  assert.equal(deep[name], lucide[name]);
  assert.equal(lucide[name].displayName, name);
  const html = renderToStringSync(() => lucide[name]({ title: name }));
  assert.ok(html.includes("<svg") && html.includes("<title>" + name + "</title>"), name + " must render its title through SSR");
}
for (const path of ["create-icon", "types", "dist/create-icon.js", "dist/types.d.ts"]) {
  await assert.rejects(import("@askrjs/lucide/" + path), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" });
}
await assert.rejects(import("@askrjs/lucide/icons/not-an-icon"), { code: "ERR_MODULE_NOT_FOUND" });
`,
  );
  execFileSync(process.execPath, ["runtime.mjs"], { cwd: consumer, stdio: "inherit" });
  writeFileSync(
    join(consumer, "types.ts"),
    `
import { ${names.join(", ")} } from "@askrjs/lucide";
${icons.map(({ name, path }) => `import { ${name} as Deep${name} } from "@askrjs/lucide/${path}";`).join("\n")}
import type { IconProps, IconSizeToken } from "@askrjs/askr/foundations/icon";
const size: IconSizeToken = "lg";
const props: IconProps = { title: "Glyph", size, class: "icon" };
const roots = [${names.join(", ")}];
const deep = [${icons.map(({ name }) => `Deep${name}`).join(", ")}];
for (const Icon of [...roots, ...deep]) Icon(props);
// @ts-expect-error factory is private in 0.5
import { createIcon } from "@askrjs/lucide";
// @ts-expect-error private shape type
import type { IconNode } from "@askrjs/lucide";
// @ts-expect-error duplicate prop alias moved to core
import type { IconProps as RemovedProps } from "@askrjs/lucide";
// @ts-expect-error duplicate size alias moved to core
import type { IconSizeToken as RemovedSize } from "@askrjs/lucide";
`,
  );
  writeFileSync(
    join(consumer, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        types: [],
      },
      files: ["types.ts"],
    }),
  );
  execFileSync(
    process.execPath,
    [join(root, "node_modules/typescript/bin/tsc"), "-p", join(consumer, "tsconfig.json")],
    { stdio: "inherit" },
  );
  for (const entry of ["@askrjs/lucide", "@askrjs/lucide/icons/search"]) {
    writeFileSync(join(consumer, "entry.js"), `export { SearchIcon } from "${entry}";`);
    const result = await build({
      root: consumer,
      configFile: false,
      logLevel: "silent",
      build: {
        write: false,
        minify: false,
        lib: { entry: join(consumer, "entry.js"), formats: ["es"] },
        rollupOptions: { external: (id) => /^@askrjs\/askr(?:\/|$)/.test(id) },
      },
    });
    const code = (Array.isArray(result) ? result : [result])
      .flatMap((bundle) => bundle.output)
      .filter((chunk) => chunk.type === "chunk")
      .map((chunk) => chunk.code)
      .join("\n");
    assert.ok(code.includes("SearchIcon"), "The selected icon must remain in the bundle");
    for (const name of names.filter((name) => name !== "SearchIcon"))
      assert.ok(
        !code.includes(`"${name}"`) && !code.includes(`'${name}'`),
        `${name} must not remain in a Search-only consumer`,
      );
  }
  console.log(
    `Packed runtime, SSR, root/deep types, metadata, private surface and tree shaking passed for ${icons.length} icons.`,
  );
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { normalize } from "node:path";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const packedResult = JSON.parse(
  execFileSync(npm, ["pack", "--ignore-scripts", "--dry-run", "--json"], {
    encoding: "utf8",
  }),
);
const packed = Array.isArray(packedResult) ? packedResult[0] : Object.values(packedResult)[0];
const files = new Set(packed.files.map(({ path }) => normalize(path)));

for (const path of files) {
  assert.match(
    path,
    /^(?:LICENSE|README\.md|package\.json|capabilities\.json|dist[\\/].+)$/,
    `unexpected packed file: ${path}`,
  );
}

for (const path of files) {
  if (!path.endsWith(".js") || path === normalize("dist/index.js")) continue;
  assert(files.has(path.replace(/\.js$/, ".d.ts")), `missing declaration for ${path}`);
  assert(files.has(`${path}.map`), `missing source map for ${path}`);
}

for (const required of [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/create-icon.js",
  "dist/create-icon.d.ts",
]) {
  assert(files.has(normalize(required)), `missing packed public artifact: ${required}`);
}

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { normalize } from "node:path";

const npmCli = process.env.npm_execpath;
assert.ok(npmCli, "Run package artifact checks through npm");
const packedResult = JSON.parse(
  execFileSync(process.execPath, [npmCli, "pack", "--ignore-scripts", "--dry-run", "--json"], {
    encoding: "utf8",
  }),
);
const packed = Array.isArray(packedResult) ? packedResult[0] : Object.values(packedResult)[0];
const files = new Set(packed.files.map(({ path }) => normalize(path)));

for (const path of files) {
  assert.match(
    path,
    /^(?:LICENSE|CHANGELOG\.md|README\.md|package\.json|capabilities\.json|dist[\\/].+)$/,
    `unexpected packed file: ${path}`,
  );
}

for (const path of files) {
  if (!path.endsWith(".js")) continue;
  if (path === normalize("dist/index.js") || path.startsWith(normalize("dist/icons/")))
    assert(files.has(path.replace(/\.js$/, ".d.ts")), `missing public declaration for ${path}`);
  // The pure export barrel has no executable body and emits no source map.
  if (path !== normalize("dist/index.js"))
    assert(files.has(`${path}.map`), `missing source map for ${path}`);
}

for (const required of ["dist/index.js", "dist/index.d.ts", "dist/create-icon.js"]) {
  assert(files.has(normalize(required)), `missing packed artifact: ${required}`);
}

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sandbox = mkdtempSync(join(tmpdir(), "askr-lucide-installed-"));
const consumer = join(sandbox, "consumer");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

try {
  const packed = JSON.parse(
    execFileSync(npm, ["pack", "--ignore-scripts", "--json", "--pack-destination", sandbox], {
      cwd: root,
      encoding: "utf8",
    }),
  );
  const { filename } = Array.isArray(packed) ? packed[0] : Object.values(packed)[0];
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, "package.json"),
    `${JSON.stringify({ name: "consumer", private: true, type: "module" }, null, 2)}\n`,
  );
  execFileSync(
    npm,
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--no-package-lock",
      join(sandbox, filename),
    ],
    { cwd: consumer, stdio: "pipe" },
  );
  writeFileSync(
    join(consumer, "smoke.mjs"),
    `import assert from "node:assert/strict";
import { createIcon, SearchIcon } from "@askrjs/lucide";
import { SearchIcon as SearchSubpathIcon } from "@askrjs/lucide/icons/search";
assert.equal(typeof createIcon, "function");
assert.equal(SearchIcon, SearchSubpathIcon);
assert.equal(SearchIcon.displayName, "SearchIcon");
`,
  );
  execFileSync(process.execPath, ["smoke.mjs"], { cwd: consumer, stdio: "pipe" });

  writeFileSync(
    join(consumer, "fixture.ts"),
    `import { SearchIcon, type IconNode, type IconProps } from "@askrjs/lucide";
import { SearchIcon as SearchSubpathIcon } from "@askrjs/lucide/icons/search";
const node: IconNode = [["path", { d: "M0 0" }]];
const props: IconProps = { title: "Search" };
void [SearchIcon, SearchSubpathIcon, node, props];
`,
  );
  execFileSync(
    process.execPath,
    [
      join(root, "node_modules", "typescript", "bin", "tsc"),
      "--ignoreConfig",
      "--noEmit",
      "--strict",
      "--target",
      "ES2022",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "fixture.ts",
    ],
    { cwd: consumer, stdio: "pipe" },
  );
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}

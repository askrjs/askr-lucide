import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import {
  collectIcons,
  generate,
  iconFileContent,
  indexEntry,
  toKebab,
} from "../scripts/generate.js";

const sandboxes: string[] = [];

function sandbox(): string {
  const path = mkdtempSync(join(tmpdir(), "askr-lucide-generator-"));
  sandboxes.push(path);
  return path;
}

function snapshot(path: string): Record<string, string> {
  return Object.fromEntries(
    readdirSync(path, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const relative = join(entry.parentPath.slice(path.length + 1), entry.name);
        return [relative, readFileSync(join(path, relative), "utf8")];
      }),
  );
}

afterEach(() => {
  for (const path of sandboxes.splice(0)) rmSync(path, { recursive: true, force: true });
});

describe("icon generator", () => {
  it("converts icon names and writes stable module syntax", () => {
    expect(toKebab("AArrowDown")).toBe("a-arrow-down");
    expect(indexEntry("Search", "search")).toBe("export { SearchIcon } from './icons/search';");
    expect(iconFileContent("Search", [["path", { d: "M0 0" }]])).toContain(
      'createIcon(\'SearchIcon\', [["path",{"d":"M0 0"}]])',
    );
  });

  it("collects the pinned source in deterministic order with unique paths", () => {
    const icons = collectIcons();
    const names = icons.map(({ name }) => name);
    expect(icons.length).toBeGreaterThan(2_000);
    expect(names).toEqual(names.toSorted((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
    expect(new Set(icons.map(({ kebab }) => kebab)).size).toBe(icons.length);
  });

  it("is byte-identical across repeated runs", () => {
    const sourceDir = sandbox();
    const icons = collectIcons();
    generate({ icons, sourceDir });
    const first = snapshot(sourceDir);
    generate({ icons, sourceDir });
    expect(snapshot(sourceDir)).toEqual(first);
  });

  it("removes stale modules when icons are removed or renamed", () => {
    const sourceDir = sandbox();
    generate({
      sourceDir,
      icons: [
        { name: "Alpha", kebab: "alpha", iconNode: [["path", { d: "M0 0" }]] },
        { name: "OldName", kebab: "old-name", iconNode: [["circle", { cx: "1" }]] },
      ],
    });
    generate({
      sourceDir,
      icons: [
        { name: "Alpha", kebab: "alpha", iconNode: [["path", { d: "M0 0" }]] },
        { name: "NewName", kebab: "new-name", iconNode: [["line", { x1: "0" }]] },
      ],
    });
    expect(readdirSync(join(sourceDir, "icons"))).toEqual(["alpha.ts", "new-name.ts"]);
    expect(readFileSync(join(sourceDir, "index.ts"), "utf8")).not.toContain("OldName");
  });
});

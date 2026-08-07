/**
 * Tests for the createIcon factory and the component it produces.
 *
 * These tests use a hand-crafted fixture IconNode — they do NOT import from
 * any generated file (src/icons/ is gitignored and not checked in).
 */
import { describe, it, expect, afterEach } from "vite-plus/test";
import { createIsland } from "@askrjs/askr/boot";
import { createIcon } from "../src/create-icon";
import type { IconNode } from "../src/types";

// Minimal fixture that mimics a real Lucide icon node (two SVG children).
const FIXTURE_NODE: IconNode = [
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["path", { d: "M21 21l-4.35-4.35" }],
];
const TestIcon = createIcon("TestIcon", FIXTURE_NODE);

function mount(element: JSX.Element): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  createIsland({ root: container, component: () => element });
  return container;
}

function unmount(container: HTMLElement | undefined): void {
  container?.remove();
}

function getNormalizedStyle(element: Element): string {
  return (element.getAttribute("style") ?? "").replace(/\s*:\s*/g, ":").replace(/;\s*/g, ";");
}

describe("createIcon — rendered output", () => {
  let container: HTMLElement;
  afterEach(() => unmount(container));

  it("should render an <svg> element", () => {
    container = mount(<TestIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("should render svg children from the icon node", () => {
    container = mount(<TestIcon />);
    expect(container.querySelector("svg circle")).not.toBeNull();
    expect(container.querySelector("svg path")).not.toBeNull();
  });

  it("should render the svg tree in the SVG namespace", () => {
    container = mount(<TestIcon />);
    const svg = container.querySelector("svg");
    const circle = container.querySelector("svg circle");
    const path = container.querySelector("svg path");

    expect(svg?.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(circle?.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(path?.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("should apply default size of 20", () => {
    container = mount(<TestIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
    expect(getNormalizedStyle(svg)).toContain("--ak-icon-size:20px");
  });

  it("should apply custom size", () => {
    container = mount(<TestIcon size={32} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
    expect(getNormalizedStyle(svg)).toContain("--ak-icon-size:32px");
  });

  it("should emit semantic size hooks for named sizes", () => {
    container = mount(<TestIcon size="sm" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("data-size")).toBe("sm");
    expect(getNormalizedStyle(svg)).toContain("--ak-icon-size:var(--ak-icon-size-sm");
  });

  it("should not emit semantic size hooks for raw CSS sizes", () => {
    container = mount(<TestIcon size="1.5rem" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("data-size")).toBeNull();
    expect(getNormalizedStyle(svg)).toContain("--ak-icon-size:1.5rem");
  });

  it("should set default stroke color to currentColor", () => {
    container = mount(<TestIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.getAttribute("data-color")).toBe("current");
  });

  it("should apply custom color via stroke attribute", () => {
    container = mount(<TestIcon color="red" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("stroke")).toBe("red");
    expect(svg.getAttribute("data-color")).toBeNull();
  });

  it("should route stroke width through the theme contract variable", () => {
    container = mount(<TestIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("stroke-width")).toBe("var(--ak-icon-stroke-width)");
    expect(getNormalizedStyle(svg)).toContain(
      "--ak-icon-stroke-width:var(--ak-icon-stroke-width-md, 2)",
    );
  });

  it("should preserve explicit stroke width overrides", () => {
    container = mount(<TestIcon strokeWidth={1.5} />);
    const svg = container.querySelector("svg")!;
    expect(getNormalizedStyle(svg)).toContain(
      "--ak-icon-stroke-width:var(--ak-icon-stroke-width-md, 1.5)",
    );
  });

  it("should set aria-hidden when no title is provided", () => {
    container = mount(<TestIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("data-decorative")).toBe("true");
  });

  it("should not set aria-hidden when title is provided", () => {
    container = mount(<TestIcon title="Search" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBeNull();
    expect(svg.getAttribute("data-decorative")).toBeNull();
  });

  it("should render a <title> element when title prop is passed", () => {
    container = mount(<TestIcon title="Search icon" />);
    const title = container.querySelector("svg title")!;
    expect(title).not.toBeNull();
    expect(title.textContent).toBe("Search icon");
  });

  it("should set role=img", () => {
    container = mount(<TestIcon />);
    expect(container.querySelector("svg")!.getAttribute("role")).toBe("img");
  });

  it("should emit stable icon theme hooks", () => {
    container = mount(<TestIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("data-slot")).toBe("icon");
    expect(svg.getAttribute("data-icon")).toBe("TestIcon");
  });

  it("should apply class prop", () => {
    container = mount(<TestIcon class="icon-sm" />);
    expect(container.querySelector("svg")!.getAttribute("class")).toBe("icon-sm");
  });

  it("should merge user style with icon contract variables", () => {
    container = mount(<TestIcon style="opacity:0.5" />);
    const style = getNormalizedStyle(container.querySelector("svg")!);
    expect(style).toContain("--ak-icon-size:20px");
    expect(style).toContain("display:inline-block");
    expect(style).toContain("flex-shrink:0");
    expect(style).toContain("opacity:0.5");
  });

  it("should pass arbitrary props through to the svg element", () => {
    container = mount(<TestIcon data-testid="my-icon" />);
    expect(container.querySelector("svg")!.getAttribute("data-testid")).toBe("my-icon");
  });

  it("should own a defensive copy of accepted definitions", () => {
    const mutable = [["circle", { cx: "4", cy: "4", r: "2" }]] as [
      string,
      Record<string, string>,
    ][];
    const StableIcon = createIcon("StableIcon", mutable);
    mutable[0][0] = "path";
    mutable[0][1].cx = "99";
    mutable.push(["line", { x1: "0", x2: "1" }]);

    container = mount(<StableIcon />);
    expect(container.querySelectorAll("svg > *")).toHaveLength(1);
    expect(container.querySelector("circle")?.getAttribute("cx")).toBe("4");
    expect(container.querySelector("path")).toBeNull();
  });

  it("should not interpret prototype-shaped attribute names while copying", () => {
    const attributes = JSON.parse('{"__proto__":"safe","d":"M0 0"}') as Record<string, string>;
    expect(() => createIcon("SafeIcon", [["path", attributes]])).toThrow(TypeError);

    expect((Object.prototype as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it.each([
    ["script elements", [["script", {}]]],
    ["event attributes", [["path", { onclick: "alert(1)" }]]],
    ["URL-bearing href values", [["use", { href: "https://evil.test/icon.svg#x" }]]],
    ["CSS URL values", [["path", { fill: "url(https://evil.test/a.svg)" }]]],
  ])("rejects unsafe %s", (_label, definition) => {
    expect(() => createIcon("UnsafeIcon", definition as IconNode)).toThrow(TypeError);
  });

  it.each([
    ["a non-array definition", null],
    ["a malformed entry", [["path"]]],
    ["non-object attributes", [["path", null]]],
    ["array attributes", [["path", []]]],
    ["non-string attribute values", [["path", { d: 42 }]]],
  ])("rejects %s", (_label, definition) => {
    expect(() => createIcon("InvalidIcon", definition as unknown as IconNode)).toThrow(TypeError);
  });
});

import { jsx as createSvgNode } from "@askrjs/askr/jsx-runtime";
import type { JSX } from "@askrjs/askr/jsx-runtime";
import { IconBase } from "@askrjs/askr/foundations/icon";
import type { IconNode, IconProps } from "./types";

const SAFE_TAGS = [
  "circle",
  "ellipse",
  "g",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
] as const;
type SafeSvgTag = (typeof SAFE_TAGS)[number];
const SAFE_TAG_SET: ReadonlySet<string> = new Set(SAFE_TAGS);
const createSafeSvgNode = createSvgNode as unknown as (
  type: SafeSvgTag,
  props: Record<string, unknown>,
  key?: string | number,
) => JSX.Element;
const SAFE_ATTRIBUTES = new Set([
  "cx",
  "cy",
  "d",
  "fill",
  "height",
  "points",
  "r",
  "rx",
  "ry",
  "width",
  "x",
  "x1",
  "x2",
  "y",
  "y1",
  "y2",
]);
const URL_ATTRIBUTE = /^(?:href|src|xlink:href)$/i;
const URL_VALUE = /url\s*\(/i;

function copyDefinition(displayName: string, iconNode: IconNode): IconNode {
  if (!Array.isArray(iconNode)) {
    throw new TypeError(`${displayName}: icon definition must be an array`);
  }

  return iconNode.map((entry) => {
    if (!Array.isArray(entry) || entry.length !== 2 || !SAFE_TAG_SET.has(entry[0])) {
      throw new TypeError(`${displayName}: icon definition contains an unsafe SVG element`);
    }
    const attributes = entry[1];
    if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) {
      throw new TypeError(`${displayName}: icon definition attributes must be an object`);
    }
    const copied = Object.create(null) as Record<string, string>;
    for (const [name, value] of Object.entries(attributes)) {
      if (
        /^on/i.test(name) ||
        /^(?:__proto__|constructor|prototype)$/i.test(name) ||
        URL_ATTRIBUTE.test(name) ||
        !SAFE_ATTRIBUTES.has(name) ||
        typeof value !== "string" ||
        URL_VALUE.test(value)
      ) {
        throw new TypeError(
          `${displayName}: icon definition contains an unsafe SVG attribute (${name})`,
        );
      }
      copied[name] = value;
    }
    return [entry[0], Object.freeze(copied)] as const;
  });
}

export function createIcon(displayName: string, iconNode: IconNode) {
  const definition = Object.freeze(copyDefinition(displayName, iconNode));

  function Icon({ ...rest }: IconProps) {
    return IconBase({
      ...rest,
      iconName: displayName,
      children: definition.map(([tag, attrs], i) =>
        createSafeSvgNode(tag as SafeSvgTag, attrs as Record<string, unknown>, i),
      ),
    });
  }

  Icon.displayName = displayName;
  return Icon;
}

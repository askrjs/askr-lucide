# @askrjs/lucide

Thin Askr wrappers for the [Lucide](https://lucide.dev) SVG icon set.

## Usage

```tsx
import { SaveIcon, TrashIcon, PlusIcon } from "@askrjs/lucide";

<SaveIcon size={16} aria-hidden="true" />;
```

## Props

| Prop          | Type               | Default | Description                          |
| ------------- | ------------------ | ------- | ------------------------------------ |
| `size`        | `number \| string` | `20`    | CSS size; SVG geometry stays 24      |
| `color`       | `string`           | current | CSS color value                      |
| `strokeWidth` | `number`           | `2`     | SVG stroke width                     |
| `aria-hidden` | `boolean`          | -       | Hide from assistive technology       |
| `aria-label`  | `string`           | -       | Forwarded; title controls visibility |

## Tree-shaking

Import icons individually - only the icons you import are bundled:

```tsx
import { ArrowRightIcon } from "@askrjs/lucide/icons/arrow-right";
```

## Generation

Icons are generated from the `lucide` package source. To regenerate after a `lucide` upgrade:

```bash
npm run generate
```

## See also

- [Lucide icon reference](https://lucide.dev/icons)
- [askr-ui composition patterns](https://github.com/askrjs/askr-ui/tree/main/docs/composition.md)

Shared prop types belong to `@askrjs/askr/foundations/icon`. The icon wrapper
forwards numeric and CSS size literals to the core CSS contract; it does not
validate CSS. Use valid nonnegative finite sizes for a visible icon. A nonempty
title removes the decorative default; an aria label alone does not override it.
See the [0.5 contract review](./0.5-contract-review.md) for migrations and tests.

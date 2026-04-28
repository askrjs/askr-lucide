# @askrjs/askr-lucide

Thin Askr wrappers for the [Lucide](https://lucide.dev) SVG icon set.

## Usage

```tsx
import { SaveIcon, TrashIcon, PlusIcon } from "@askrjs/askr-lucide";

<SaveIcon size={16} aria-hidden="true" />;
```

## Props

| Prop          | Type               | Default | Description                    |
| ------------- | ------------------ | ------- | ------------------------------ |
| `size`        | `number \| string` | `24`    | Width and height in px         |
| `color`       | `string`           | current | CSS color value                |
| `strokeWidth` | `number`           | `2`     | SVG stroke width               |
| `aria-hidden` | `boolean`          | —       | Hide from assistive technology |
| `aria-label`  | `string`           | —       | Accessible label when visible  |

## Tree-shaking

Import icons individually — only the icons you import are bundled:

```tsx
import { ArrowRightIcon } from "@askrjs/askr-lucide/icons/arrow-right";
```

## Generation

Icons are generated from the `lucide` package source. To regenerate after a `lucide` upgrade:

```bash
npm run generate
```

## See also

- [Lucide icon reference](https://lucide.dev/icons)
- [askr-ui composition patterns](../askr-ui/docs/composition.md)

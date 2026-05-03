# @askrjs/lucide

Thin Askr wrappers for the [Lucide](https://lucide.dev) SVG icon set.

## Install

```bash
npm install @askrjs/lucide
```

Requires `@askrjs/askr` as a peer dependency.

## Usage

```tsx
import { SearchIcon, XIcon, MenuIcon } from "@askrjs/lucide";

function App() {
  return (
    <div>
      <SearchIcon />
      <XIcon size={16} />
      <MenuIcon color="blue" strokeWidth={1.5} />
    </div>
  );
}
```

## Contract

Every generated icon follows the same SVG contract:

- `data-slot="icon"`
- `data-icon="<IconName>"`
- `data-size="sm|md|lg|xl"` for semantic named sizes
- `data-decorative="true"` when no `title` is provided
- `data-color="current"` when the icon inherits `currentColor`

Icons also resolve size and stroke width through CSS custom properties:

- `--ak-icon-size`
- `--ak-icon-stroke-width`

The icon contract itself is owned by `@askrjs/askr/foundations`. Official themes are expected to provide the semantic token layer behind those variables, for example `--ak-icon-size-sm` or `--ak-icon-stroke-width-md`.

## Accessibility

By default, icons render with `aria-hidden="true"` so they are decorative unless you provide a `title`.

```tsx
<SearchIcon title="Search" />
```

Passing a `title` removes `aria-hidden` and renders a `<title>` element inside the SVG.

## Tree shaking

Each icon is a named export. Import only what you use:

```tsx
import { SearchIcon } from "@askrjs/lucide";
```

```tsx
import { SearchIcon } from "@askrjs/lucide/icons/search";
```

The package is marked `"sideEffects": false` and built with `preserveModules`, so bundlers can eliminate unused icons completely.

## Philosophy

This package is a generated binding layer, not an icon framework. It does not:

- provide a string-based `<Icon name="x" />` API
- ship a runtime icon registry
- depend on Lucide at runtime

`createIcon` is a thin adapter over `@askrjs/askr/foundations`' `IconBase`. It closes over static SVG node data and returns a plain Askr component function that implements the shared icon contract.

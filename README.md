# @askrjs/lucide

[![CI](https://github.com/askrjs/askr-lucide/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/askrjs/askr-lucide/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40askrjs%2Flucide.svg)](https://www.npmjs.com/package/@askrjs/lucide)

Thin Askr wrappers for the [Lucide](https://lucide.dev) SVG icon set.

## Install

```bash
npm install @askrjs/lucide
```

Requires `@askrjs/askr` `>=0.2.0 <0.3.0` as a peer dependency.
The repo toolchain expects Node `24+` for local builds and tests.

## Usage

```tsx
import { SearchIcon } from "@askrjs/lucide/icons/search";
import { XIcon } from "@askrjs/lucide/icons/x";
import { MenuIcon } from "@askrjs/lucide/icons/menu";

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

For production applications, prefer per-icon subpath imports. They avoid loading
the roughly 2,000-module root barrel in development servers and bundlers that do
not aggressively eliminate unused exports:

```tsx
import { SearchIcon } from "@askrjs/lucide/icons/search";
```

The root barrel is convenient for prototyping. If you use it in production,
verify tree shaking in your bundler:

```tsx
import { SearchIcon } from "@askrjs/lucide";
```

The package is marked `"sideEffects": false` and built with `preserveModules`, so bundlers can eliminate unused icons completely.

## Philosophy

This package is a generated binding layer, not an icon framework. It does not:

- provide a string-based `<Icon name="x" />` API
- ship a runtime icon registry
- depend on Lucide at runtime

`createIcon` is a thin adapter over `@askrjs/askr/foundations`' `IconBase`. It closes over static SVG node data and returns a plain Askr component function that implements the shared icon contract.

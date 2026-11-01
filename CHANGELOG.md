# Changelog

## Unreleased

## 0.5.1 - 2026-11-01

### Changed

- Refresh the generated icon set from Lucide 1.34.0 to 1.66.0: add 257 icon
  exports and update 100 SVG definitions without removing existing icon names.

### Development

- Upgrade the build and test toolchain to Vite+ 1.4 / Vitest 5 and refresh
  development dependencies.

## 0.5.0 - 2026-10-12

### Breaking changes

- Move `createIcon` and `IconNode` to the private generated-wrapper implementation.
  Custom icons compose `IconBase` from `@askrjs/askr/foundations/icon` with SVG children.
- Remove the duplicate root `IconProps` and `IconSizeToken` aliases. Import both
  from `@askrjs/askr/foundations/icon`. Generated icon names and documented per-icon
  paths retain their contracts.

### Fixes

- Correct documentation for the minimum Askr peer, default CSS size, and title
  accessibility precedence. Exercise real app cleanup in icon DOM tests.

### Development

- Refresh the locked development toolchain within its existing ranges: Vite+ 0.3.3 uses patched Tinypool 2.1.2, and source-map-js resolves to 1.2.2. Package runtime dependencies and public contracts are unchanged.

- First-party development workflows use Vite+; specialized compiler, runtime,
  browser, and package checks remain part of validation.

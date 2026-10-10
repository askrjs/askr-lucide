# Changelog

## Unreleased

## 0.5.0 - 2026-10-10

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

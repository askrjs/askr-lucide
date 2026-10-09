# Changelog

## Unreleased

### Breaking changes

- Move `createIcon` and `IconNode` to the private generated-wrapper implementation.
  Custom icons compose `IconBase` from `@askrjs/askr/foundations/icon` with SVG children.
- Remove the duplicate root `IconProps` and `IconSizeToken` aliases. Import both
  from `@askrjs/askr/foundations/icon`. Generated icon names and documented per-icon
  paths retain their contracts.

### Fixes

- Correct documentation for the minimum Askr peer, default CSS size, and title
  accessibility precedence. Exercise real app cleanup in icon DOM tests.

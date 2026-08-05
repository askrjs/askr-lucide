# AGENTS.md

Operational guide for contributors to `@askrjs/lucide`.

## Scope

This repository owns generated Askr wrappers for Lucide SVG icons.

## Ground rules

1. Keep generated icons consistent with the shared `IconBase` contract.
2. Update the generator or source data rather than hand-editing generated icon
   modules.
3. Preserve named exports, tree-shakeable subpath exports, and accessibility
   defaults.

## Validation

Run `npm run check` before opening a pull request.

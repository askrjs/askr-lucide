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

## Askr North Star

Keep every icon export a thin, narratable wrapper over the shared icon
contract. Enforce SVG, naming, generation, and accessibility invariants in the
generator or shared primitive with messages that identify the icon and the
required correction. Keep upstream metadata, generation, exports, and package
artifacts as visible seams. Prefer explicit named exports over runtime discovery
or a global registry. Add public surface only when a demonstrated Askr
application needs it; do not chase upstream parity as an end in itself.

## Validation

Run `npm run check` before opening a pull request.

## Optimization Gate

A benchmark number is only half of an optimization's success criterion. The
change must also preserve a causal path that a human or agent can narrate in one
sentence.

Every benchmark-driven change must include:

1. the one-sentence causal description of the optimized path;
2. the exact fallback trigger and proof that optimized and fallback paths have
   identical observable behavior and error surfaces;
3. an explicit legibility-cost statement, including `none` when no new path or
   concept is introduced; and
4. evidence that a measured bottleneck in a real application justifies the
   optimization now.

Prefer making the existing single path faster. New caches, inference,
memoization, shortcuts, fast paths, or scheduler states require an explicit
legibility decision; a speedup alone does not justify them.

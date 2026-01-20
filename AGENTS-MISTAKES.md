# Agent Mistakes Log

## Mistake 1: Incorrect Import Extension Handling

**Date**: 2026-01-20

**What went wrong**: 
- Removed `.ts` extensions from imports when SvelteKit's `rewriteRelativeImportExtensions` was enabled
- This caused type-checking errors because the project convention requires full extensions
- AGENTS.md clearly states: "ALWAYS use full file extension in imports (including .ts)"

**Root cause**:
- Did not follow the project's AGENTS.md import conventions
- Assumed SvelteKit default behavior instead of checking project guidelines

**Correct approach**:
1. For `$lib` imports: Use `.ts` extension (e.g., `'$lib/types.ts'`)
2. For `$stores` imports: Use `.svelte` extension (e.g., `'$stores/user.svelte'`)
3. The `rewriteRelativeImportExtensions` in tsconfig.json handles the compilation

**Fix applied**:
- Reverted all imports to include full extensions as per AGENTS.md guidelines
- Kept $stores alias in svelte.config.js for consistency

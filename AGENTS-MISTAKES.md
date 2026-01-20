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

---

## Mistake 2: Svelte 5 Runes - Reactivity Pattern Misunderstanding

**Date**: 2026-01-20

**What went wrong**:
- Used `let user = getCurrentUser()` which captures the value once, not reactively
- Used old Svelte 4 syntax `$:` for reactive statements instead of Svelte 5 `$derived()`
- Did not use `$state()` for component-local state variables
- This caused components to not react to store changes, especially after page navigation

**Root cause**:
- Did not properly understand Svelte 5 runes pattern for sharing reactive state
- Mixed Svelte 4 and Svelte 5 syntax
- Forgot that `window.location.href` causes full page reload, clearing in-memory state

**Correct approach for Svelte 5**:
1. **Component-local state**: Use `$state()` - e.g., `let showModal = $state(false)`
2. **Derived/reactive values**: Use `$derived()` - e.g., `let user = $derived(getCurrentUser())`
3. **NO MORE `$:`**: Replace all `$: foo = bar()` with `let foo = $derived(bar())`
4. **Store pattern**: Export getter functions that return the state value, so `$derived()` can track changes
5. **Persistence**: For state that survives page reloads, persist to localStorage

**Wrong pattern (Svelte 4 style)**:
```typescript
let user = getCurrentUser()  // ❌ Not reactive
let showModal = false        // ❌ Not reactive in Svelte 5
$: progress = getProgress()  // ❌ Old syntax
```

**Correct pattern (Svelte 5 style)**:
```typescript
let user = $derived(getCurrentUser())     // ✅ Reactive
let showModal = $state(false)             // ✅ Reactive state
let progress = $derived(getProgress())    // ✅ Reactive derived
```

**Fix applied**:
- Updated all components to use `$derived()` for store-derived values
- Updated all components to use `$state()` for local state
- Removed all `$:` reactive statements
- Added `saveCurrentUser()` and `loadCurrentUser()` to persist user across page reloads
- Files fixed: `/routes/+page.svelte`, `/routes/chapters/+page.svelte`, `/routes/story/+page.svelte`, `/routes/progress/+page.svelte`

**Key learning**:
- In Svelte 5, reactivity is explicit with runes (`$state`, `$derived`, `$effect`)
- Store getter functions must be wrapped in `$derived()` to be reactive in components
- Page navigations with `window.location.href` reload the app, so critical state must be persisted
- ALWAYS check AGENTS.md for framework-specific guidelines (mentions "Embrace newest features such as $state/$derived/$props")

---

## Mistake 3: currentUser State Not Persisted to localStorage

**Date**: 2026-01-20

**What went wrong**:
- `currentUser` state was only stored in memory
- After `window.location.href = '/chapters'` caused page reload, `currentUser` was null
- This caused `/chapters` page to always redirect back to `/` because `!user` check failed

**Root cause**:
- Only persisted `profiles` array to localStorage, not the `currentUser` reference
- Did not anticipate that navigation causes full page reload in this app architecture

**Correct approach**:
1. Persist both `profiles` AND `currentUser` to localStorage
2. Load both on app initialization
3. Call `saveCurrentUser()` whenever `currentUser` changes

**Fix applied**:
- Added `saveCurrentUser()` function to save current user to localStorage
- Updated `loadProfiles()` to also load `currentUser` from localStorage
- Updated `setCurrentUser()` to call `saveCurrentUser()`
- Updated `createProfile()` to set `currentUser` before saving

**Files modified**: `/stores/user.svelte.ts`

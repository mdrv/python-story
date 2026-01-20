# Python Story - Agent Guide

This guide helps AI agents work effectively with the Python Story codebase - a SvelteKit + TypeScript application for teaching Python to children through interactive storytelling.

## Quick Reference

```bash
# Development
bun run dev        # Start dev server (localhost:5173)
bun run d          # Alias for dev

# Building
bun run build      # Production build (includes Panda CSS codegen)
bun run b          # Alias for build

# Other
bun run preview    # Preview production build
bun run codegen    # Generate Panda CSS
bun run check      # TypeScript type checking
```

## Project Overview

**Purpose**: A web-based Python learning platform for children (ages 8-14) that teaches programming through interactive storytelling and fiction.

**Tech Stack**:
- **Framework**: SvelteKit with Svelte 5 (runes: `$state`, `$derived`, `$props`, `$effect`)
- **Language**: TypeScript (strict mode)
- **Runtime**: Bun
- **Styling**: Panda CSS (CSS-in-JS, type-safe)
- **Code Editor**: CodeMirror 6
- **Python Runtime**: Pyodide (WebAssembly, runs in browser)

**Architecture**:
- Client-side only (no backend)
- All data persisted to localStorage
- Python code executes entirely in browser via Pyodide

## Essential Commands

### Development Workflow

```bash
# First time setup
bun install
bun run codegen    # Generate Panda CSS utilities
bun run dev        # Start dev server
```

### Before Making Changes

```bash
# Always run codegen if you add new Panda CSS utilities
bun run codegen

# Check for TypeScript errors
bun run check
```

### Building for Production

```bash
bun run build      # Runs panda codegen + vite build
bun run preview    # Preview production build locally
```

## Code Organization

### Directory Structure

```
src/
├── lib/
│   ├── content/              # Static data (story, lessons, achievements)
│   │   ├── story.ts          # Chapter/scene data
│   │   ├── lessons.ts        # Lesson content
│   │   └── achievements.ts  # Achievement definitions
│   ├── types.ts              # TypeScript interfaces
│   └── assets/              # Static assets (favicon, etc.)
├── stores/                   # Svelte 5 stores (.svelte.ts)
│   ├── user.svelte.ts        # User profiles, auth
│   ├── pyodide.svelte.ts    # Python execution engine
│   ├── story.svelte.ts       # Story navigation state
│   └── progress.svelte.ts    # Progress tracking, achievements
├── routes/                   # SvelteKit file-based routing
│   ├── +layout.svelte       # Root layout (Pyodide init)
│   ├── +page.svelte         # Home/profile selection
│   ├── story/               # Story viewer and challenges
│   │   ├── +page.svelte
│   │   └── Challenge.svelte
│   ├── chapters/            # Chapter selection
│   └── progress/            # Progress dashboard
└── components/              # Reusable components (if any)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/types.ts` | Central type definitions for entire app |
| `src/stores/pyodide.svelte.ts` | Python execution, Pyodide initialization |
| `src/stores/user.svelte.ts` | User profile management, localStorage |
| `src/stores/story.svelte.ts` | Story/scene navigation state |
| `src/stores/progress.svelte.ts` | Progress tracking, achievements, streaks |
| `src/lib/content/story.ts` | All story data, chapters, scenes, challenges |
| `src/routes/story/Challenge.svelte` | Code editor component with CodeMirror 6 |
| `src/routes/+layout.svelte` | Root layout, initializes Pyodide |
| `panda.config.ts` | Panda CSS configuration, theme tokens |
| `svelte.config.js` | SvelteKit config, path aliases (`$stores`) |

## Code Patterns & Conventions

### Svelte 5 Runes (Critical - Not Legacy Svelte!)

This project uses **Svelte 5 runes**, NOT the old store/writable pattern. Always use:

```typescript
// ✅ CORRECT: Svelte 5 runes
let count = $state(0)              // Reactive state
let doubled = $derived(count * 2)   // Derived values
let { props } = $props()           // Component props

$effect(() => {
  // Side effects (like React's useEffect)
  console.log(count)
})

// ❌ WRONG: Old Svelte stores
import { writable } from 'svelte/store'
// DON'T USE THIS
```

### Store Pattern (`.svelte.ts` files)

State is managed in module-level `.svelte.ts` files:

```typescript
// stores/user.svelte.ts
import type { UserProfile } from '$lib/types.ts'

// Module-level state
let currentUser = $state<UserProfile | null>(null)

// Exported getter functions
export function getCurrentUser() {
  return currentUser
}

// Exported setter functions (with side effects)
export function setCurrentUser(user: UserProfile | null): void {
  currentUser = user
  if (user) {
    saveProfiles()
    saveCurrentUser()
  }
}

// Private helper functions
function saveProfiles(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profiles', JSON.stringify(profiles))
  }
}

// Load on module import
loadProfiles()
```

### TypeScript Conventions

- **Strict mode enabled**: All types must be properly defined
- **Central types**: All interfaces in `src/lib/types.ts`
- **Import paths**: Use `$lib` for `src/lib`, `$stores` for `src/stores`

```typescript
// Import types
import type { UserProfile, UserProgress, Challenge } from '$lib/types.ts'

// Import store functions
import { getCurrentUser, setCurrentUser } from '$stores/user.svelte.ts'
import { executePython } from '$stores/pyodide.svelte.ts'
```

### Component Props (Svelte 5)

```svelte
<script lang="ts">
interface Props {
  challenge: Challenge
  onComplete: () => void
  onClose: () => void
}

// Destructure with $props()
let { challenge, onComplete, onClose }: Props = $props()
</script>
```

### Using Derived Values in Components

```svelte
<script lang="ts">
import { getCurrentUser } from '$stores/user.svelte.ts'
import { isPyodideLoading } from '$stores/pyodide.svelte.ts'

// $derived() creates reactive derived values
let user = $derived(getCurrentUser())
let pyodideLoading = $derived(isPyodideLoading())
</script>

{#if user}
  <div>Welcome, {user.displayName}</div>
{:else}
  <div>Please create a profile</div>
{/if}
```

## State Persistence

### localStorage Pattern

All user data persists to localStorage (no backend/database):

```typescript
// Check for browser environment (SSR-safe)
function saveData(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('key', JSON.stringify(data))
  }
}

function loadData(): void {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('key')
    if (saved) {
      data = JSON.parse(saved)
    }
  }
}
```

### Data Storage Keys

- `profiles` - Array of all user profiles
- `currentUser` - Currently logged-in user
- `progress-{userId}` - User progress for specific user

## Python Code Execution

### Pyodide Initialization

**Critical**: Pyodide is initialized once in `+layout.svelte` onMount:

```typescript
// src/routes/+layout.svelte
import { onMount } from 'svelte'
import { initPyodide } from '$stores/pyodide.svelte'

onMount(() => {
  initPyodide()  // Loads Pyodide from CDN
})
```

**Do not reinitialize Pyodide** - use the singleton from `pyodide.svelte.ts`.

### Executing Python Code

```typescript
// src/stores/pyodide.svelte.ts
import { executeWithTimeout, resetEnvironment } from '$stores/pyodide.svelte'

// Execute with timeout (5 second default)
const result = await executeWithTimeout(code, 5000)

// result structure:
// {
//   output: string,
//   error: string | null,
//   executionTime: number,
//   variables: Record<string, any>
// }

// Reset Python environment (clear variables)
resetEnvironment()
```

### Challenge Validation

Challenges validate TWO things:
1. **Output match**: `output.trim() === challenge.expectedOutput.trim()`
2. **Code patterns**: `challenge.requiredPatterns.every(pattern => code.includes(pattern))`

```typescript
// src/routes/story/Challenge.svelte
const outputMatches = output.trim() === challenge.expectedOutput.trim()
const patternsMatch = !challenge.requiredPatterns || challenge.requiredPatterns.every(pattern =>
  code.includes(pattern)
)
const isCorrect = outputMatches && patternsMatch
```

## CodeMirror 6 Editor

The code editor uses CodeMirror 6 with extensions:

```typescript
import { EditorView, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { python } from '@codemirror/lang-python'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'

// Initialize editor
view = new EditorView({
  state: EditorState.create({
    doc: code,
    extensions: [
      oneDark,                    // Custom theme
      lineNumbers(),
      highlightActiveLine(),
      python(),                   // Python language support
      keymap.of([...defaultKeymap, indentWithTab]),
      updateListener             // Listen for code changes
    ]
  }),
  parent: editorParent
})

// Cleanup in onDestroy
onDestroy(() => {
  if (view) view.destroy()
})
```

## Adding Content

### Adding New Chapters

1. Edit `src/lib/content/story.ts`
2. Add chapter object to `STORY_DATA.chapters` array
3. Set `requirements` for chapter prerequisites
4. Add scenes with optional challenges

```typescript
{
  id: 'chapter-4',
  title: 'New Chapter',
  description: 'Learn something new',
  order: 4,
  requirements: ['print', 'variables', 'loops', 'conditionals'],
  scenes: [
    // Add scenes here
  ]
}
```

### Adding Challenges

Challenges have two validation methods:
- **expectedOutput**: Exact match of Python output
- **requiredPatterns**: Array of strings that must be in code

```typescript
challenge: {
  type: 'exercise',
  problem: 'Create a variable named x with value 10',
  lesson: 'variables',
  starterCode: '# Create variable here\n',
  expectedOutput: '10',
  requiredPatterns: ['x = 10', 'print(x)'],  // Must use specific pattern
  solution: 'x = 10\nprint(x)',
  hints: ['Hint 1', 'Hint 2', 'Hint 3']
}
```

### Adding Achievements

1. Edit `src/lib/content/achievements.ts`
2. Add to `ACHIEVEMENTS` array
3. Trigger in `stores/progress.svelte.ts`:

```typescript
// In stores/progress.svelte.ts
export function unlockAchievement(achievementId: string): boolean {
  if (!progress || isAchievementUnlocked(achievementId)) {
    return false
  }
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
  if (achievement) {
    progress.achievements.push({
      ...achievement,
      unlockedAt: new Date()
    })
    saveProgress()
    return true
  }
  return false
}
```

## Styling with Panda CSS

### Configuration

Panda CSS is configured in `panda.config.ts`:

- **Theme tokens**: Extended color palette (primary, accent, success, error)
- **Output**: `styled-system/` directory
- **Include**: `src/**/*.{js,jsx,ts,tsx}`

### Generating CSS

**Always run `bun run codegen` after**:
- Adding new utilities in config
- Using Panda utilities in new files
- Changing theme tokens

```bash
bun run codegen
```

### Using Panda Utilities

Import generated utilities in `app.css`:

```css
@layer reset, base, tokens, recipes, utilities;
```

Then use in components (the utilities are auto-generated based on usage):

```svelte
<div class="flex items-center gap-2">
  <button class="px-4 py-2 bg-primary-500 text-white rounded">
    Click me
  </button>
</div>
```

## Important Gotchas

### Pyodide Loading

- **Large bundle**: ~15MB loaded from CDN
- **Timeout**: 5-second execution timeout to prevent infinite loops
- **Safety**: Restricted module access (no `os`, `sys`, network)
- **Initialization**: Must wait for Pyodide to load before executing code
- **Check loading state**: Use `isPyodideLoading()` before running code

```typescript
import { isPyodideLoading } from '$stores/pyodide.svelte.ts'

if (isPyodideLoading()) {
  error = 'Python environment is still loading, please wait...'
  return
}
```

### Svelte 5 Migration Gotchas

1. **No `writable()` stores** - use module-level `$state`
2. **No `$:` reactive statements** - use `$derived` or `$effect`
3. **Props are destructured with `$props()`** - not `export let`
4. **No `onMount` for reactive code** - use `$effect(() => {...})`
5. **SSR checks**: Always check `typeof window !== 'undefined'` before using localStorage

### Challenge Validation Logic

- Output must match **exactly** (trim whitespace)
- Code patterns are checked via `code.includes(pattern)`
- Both conditions must be true for challenge to pass
- Patterns ensure students use required approach (not just correct output)

### localStorage Persistence

- All data in localStorage (no backend sync)
- Progress doesn't sync across devices
- Clearing localStorage loses all progress
- Keys: `profiles`, `currentUser`, `progress-{userId}`

### Path Aliases

- `$lib` → `src/lib`
- `$stores` → `src/stores` (defined in `svelte.config.js`)
- Use these in imports, not relative paths

```typescript
// ✅ CORRECT
import type { UserProfile } from '$lib/types.ts'
import { getCurrentUser } from '$stores/user.svelte.ts'

// ❌ WRONG (relative paths)
import type { UserProfile } from '../lib/types.ts'
```

## Testing

**Current Status**: No test files exist in the project (no `*.test.*` or `*.spec.*` files found).

When adding tests:
1. Follow SvelteKit testing patterns
2. Test Pyodide integration carefully (it requires browser environment)
3. Test localStorage persistence with mocks
4. Consider using Vitest (already part of SvelteKit)

## Common Patterns

### Navigation

```typescript
// URL parameter navigation
const params = new URLSearchParams(window.location.search)
const chapterId = params.get('chapter') || 'chapter-1'

// Direct navigation
window.location.href = '/chapters'
```

### Conditional Rendering

```svelte
{#if condition}
  <div>True</div>
{:else if otherCondition}
  <div>Other</div>
{:else}
  <div>False</div>
{/if}
```

### Lists/Iteration

```svelte
{#each items as item, index (item.id)}
  <div>{index}: {item.name}</div>
{/each}
```

### Event Handlers

```svelte
<button on:click={handleClick}>Click</button>
<button onclick={() => showChallenge = true}>Show</button>
```

## Troubleshooting

### Pyodide Won't Load

1. Check browser console for CDN errors
2. Verify network access to `cdn.jsdelivr.net`
3. Check `isPyodideLoading()` state in components
4. Look for errors in `pyodide.svelte.ts`

### TypeScript Errors

1. Run `bun run check` for full error report
2. Check types are imported from `$lib/types.ts`
3. Verify props use `$props()` syntax
4. Ensure all `any` types are replaced with proper interfaces

### Panda CSS Not Working

1. Run `bun run codegen`
2. Check `app.css` imports generated utilities
3. Verify config includes your files
4. Clear `.svelte-kit` and rebuild

### State Not Updating

1. Ensure state uses `$state()`, not plain variables
2. Check derived values use `$derived()`
3. Verify side effects use `$effect()`
4. Ensure functions are exported from stores

## OpenSpec Integration

This project uses OpenSpec for spec-driven development. See `openspec/AGENTS.md` for:
- How to create change proposals
- Spec file formats
- Validation workflows
- Archiving process

Key OpenSpec commands:
```bash
openspec list                  # List active changes
openspec validate <id> --strict --no-interactive
openspec archive <change-id> --yes
```

## Project-Specific Knowledge

### Target Audience

- Ages 8-14 children
- Beginner to intermediate Python learners
- Gamified learning (achievements, streaks, badges)

### Content Themes

- Python City narrative with characters (Zara, Byte, Max, Luna)
- Real-world Python problems (variables, loops, conditionals)
- Progressive difficulty (chapters have prerequisites)

### Achievement System

- Triggered by completing exercises/chapters
- Streak tracking (daily activity)
- Concept mastery scores per topic
- Visual badges and notifications

## Summary Checklist

When working on this project:

- [ ] Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`)
- [ ] Run `bun run codegen` after Panda CSS changes
- [ ] Check `typeof window !== 'undefined'` for localStorage
- [ ] Import from `$lib` and `$stores`, not relative paths
- [ ] Use module-level `$state` in `.svelte.ts` files
- [ ] Wait for Pyodide to load before executing code
- [ ] Validate challenges with both output AND code patterns
- [ ] Run `bun run check` before committing
- [ ] Follow existing code patterns (see representative files)
- [ ] Test in browser (Pyodide requires browser environment)

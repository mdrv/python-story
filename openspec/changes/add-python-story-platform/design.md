# Design: Python Story Learning Platform

## Context
This is a greenfield project targeting children aged 8-14 who want to learn Python through interactive storytelling. The platform combines narrative fiction with hands-on coding exercises to make programming concepts engaging and relatable.

**Key Constraints:**
- Must run entirely in browser (no backend deployment initially)
- Age-appropriate UI/UX with engaging visuals
- Safe, sandboxed code execution
- Responsive design for tablets and desktops

## Goals / Non-Goals

**Goals:**
- Immersive storytelling that teaches Python through problem-solving
- Zero-configuration setup for children (run in browser)
- Gamified progress tracking with achievements
- Safe code execution environment
- Extensible content system for adding stories and lessons

**Non-Goals:**
- Advanced Python concepts (OOP, classes, decorators in v1)
- Real-time collaboration features
- Backend persistence (use localStorage initially)
- Mobile phone optimization (focus on tablet+)
- Teacher/admin dashboard (later phase)

## Decisions

### Tech Stack
- **SvelteKit**: Latest version with Svelte 5 for reactive components and simple state management
- **TypeScript**: Strict mode for type safety across the application
- **Bun**: Package manager and potential server-side execution (future)
- **Panda CSS**: For consistent, type-safe styling without hardcoded classes
- **Pyodide (WASM)**: Python runtime in browser for code execution
- **CodeMirror 6**: For code editor with Python syntax highlighting

**Rationale:**
- Svelte 5's runes ($state, $derived) simplify reactive patterns vs React
- Pyodide provides full Python 3 in browser without server
- Panda CSS avoids tailwind class sprawl while maintaining design consistency
- WASM eliminates need for backend code execution service

### Architecture Pattern
- **Frontend-only initially**: All state in Svelte 5 stores (.svelte.ts)
- **Content as JSON data**: Stories, lessons, exercises stored as typed JSON
- **Component-based UI**: Reusable components for story viewer, editor, quizzes
- **Progress in localStorage**: User progress persisted locally for simplicity

**Data Flow:**
```
Story Content → Story Store → Story Viewer Component → User Interaction
                                    ↓
Lesson Content → Lesson Store → Lesson Component → Exercise/Quiz
                                    ↓
Code Editor → Pyodide Sandbox → Output Display → Progress Update → LocalStorage
```

### Content Structure
Stories contain chapters with embedded Python challenges:

```typescript
interface Chapter {
  id: string
  title: string
  scenes: Scene[]
  requirements: string[] // Python concepts needed
}

interface Scene {
  id: string
  text: string // Story narrative
  character?: Character
  challenge?: Challenge // Optional coding challenge
  choices?: Choice[] // Story branching
}

interface Challenge {
  type: 'exercise' | 'quiz'
  problem: string // What the character needs help with
  lesson: string // Concept reference
  starterCode?: string // Code template
  solution: string // For auto-verification
  hints: string[]
}
```

### Code Execution Strategy
Use Pyodide (Python compiled to WebAssembly) for browser-based execution:

**Pros:**
- Full Python 3.11 compatibility
- No server needed
- Fast execution for simple scripts
- Common data science libraries available

**Implementation:**
- Load Pyodide from CDN (~15MB initial load)
- Create isolated execution context per user session
- Limit execution time (5s max)
- Block dangerous modules (os, subprocess, etc.)
- Capture stdout/stderr for output display

**Fallback:** If Pyodide proves too heavy, switch to remote execution via serverless function.

### State Management Strategy
Use Svelte 5's runes in .svelte.ts store files:

```typescript
// stores/progress.svelte.ts
let currentProgress = $state<UserProgress>(loadFromStorage())
export const getProgress = () => currentProgress
export const updateProgress = (chapterId: string, completed: boolean) => {
  currentProgress.completedChapters[chapterId] = completed
  saveToStorage(currentProgress)
}
```

**Pattern:**
- Never export state directly (Svelte 5 limitation)
- Export getter functions and mutator functions
- Use $effect for side effects (persistence)

### UI/UX Design Philosophy
- **Story-first**: Narrative takes center stage, coding is a tool
- **Character-driven**: Characters guide the learning journey
- **Immediate feedback**: Code results shown instantly
- **Gradual difficulty**: Start with print(), progress to loops/conditions
- **Encouraging**: Celebrate small wins with sounds/animations

**Color Scheme:**
- Primary: Blue-purple gradient (magical, storytelling)
- Accent: Gold (achievements, highlights)
- Success: Green (code execution, correct answers)
- Error: Soft red (mistakes are learning opportunities)

## Risks / Trade-offs

### Risk: Pyodide bundle size (15MB+)
**Mitigation:**
- Show loading animation during initialization
- Preload during story intro
- Consider lazy loading for later chapters

### Risk: Limited Python libraries in WASM
**Mitigation:**
- Focus on core Python (no external libraries in v1)
- Document which modules are available
- Provide clear error messages for unsupported imports

### Risk: Children getting stuck on syntax errors
**Mitigation:**
- Provide 3-5 hints per exercise
- Show friendly error messages
- "Show solution" option after 3 failed attempts

### Trade-off: Local storage vs backend
**Decision:**
- Use localStorage for simplicity and privacy
- Note: Progress doesn't sync across devices
- Future: Add optional cloud sync with account system

### Risk: Story engagement vs coding balance
**Mitigation:**
- Keep story segments short (2-3 minutes reading)
- Code challenges should feel like helping characters
- Test with target age group for pacing

## Migration Plan
N/A - greenfield project

## Open Questions
1. **Age range targeting**: Should we support 6-8 (younger) or 10-14 (older)?
   - Decision: Start with 8-14, adjust reading level after user testing

2. **Story genre**: Adventure, mystery, sci-fi, fantasy?
   - Decision: Adventure in a futuristic city (relatable tech problems)

3. **Code difficulty progression**: How many concepts before mastery?
   - Decision: 3-5 exercises per concept before moving to next

4. **Monetization**: Free vs paid?
   - Decision: Free v1, consider premium content for v2

5. **Accessibility**: Screen reader support level?
   - Decision: Full WCAG 2.1 AA compliance for v1

6. **Internationalization**: Single language initially?
   - Decision: English-only v1, architecture for i18n later

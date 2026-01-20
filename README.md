# Python Story 🐍

A web-based Python learning platform for children that teaches programming through interactive storytelling and fiction.

## ✨ Features

- **📖 Interactive Storytelling**: Follow characters through a narrative adventure in Python City
- **💻 Hands-on Coding**: Write real Python code in a browser-based editor with syntax highlighting
- **🏆 Progress Tracking**: Earn achievements and badges as you learn
- **🎨 Child-Friendly UI**: Designed for ages 8-14 with engaging visuals and encouraging feedback
- **🔒 Safe Code Execution**: Runs Python in the browser using WebAssembly (Pyodide)
- **📊 Learning Dashboard**: Track chapters completed, exercises solved, and streak days
- **🎯 Chapter System**: Progress through structured chapters with prerequisites

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mdrv/python-story.git
cd python-story
```

2. Install dependencies:
```bash
bun install
```

3. Generate Panda CSS:
```bash
bun run codegen
```

4. Start the development server:
```bash
bun run dev
# or use shorthand
bun run d
```

5. Open http://localhost:5173 in your browser

## 🏗️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/) (runes: $state, $derived, $props)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Runtime**: [Bun](https://bun.sh)
- **Styling**: [Panda CSS](https://panda-css.com/)
- **Code Editor**: [CodeMirror 6](https://codemirror.net/)
- **Python Runtime**: [Pyodide](https://pyodide.org/) (WebAssembly)

## 📁 Project Structure

```
src/
├── lib/
│   ├── content/              # Story data, lessons, achievements
│   │   ├── story.ts          # Story chapters and scenes
│   │   ├── lessons.ts        # Python lessons and exercises
│   │   └── achievements.ts   # Badges and achievements
│   ├── types.ts              # TypeScript interfaces
│   └── assets/               # Static assets (favicon, etc.)
├── routes/                   # SvelteKit routes
│   ├── +page.svelte         # Home/profile selection
│   ├── +layout.svelte       # Root layout with Pyodide init
│   ├── chapters/            # Chapter selection page
│   ├── story/               # Story viewer and code challenges
│   │   ├── +page.svelte     # Main story interface
│   │   └── Challenge.svelte # Code editor component
│   └── progress/            # Progress dashboard
├── stores/                   # Svelte 5 stores (.svelte.ts)
│   ├── story.svelte.ts      # Story navigation state
│   ├── user.svelte.ts       # User profiles and auth
│   ├── progress.svelte.ts   # Progress tracking and achievements
│   └── pyodide.svelte.ts    # Python execution engine
└── app.css                   # Panda CSS entry point
```

## 📚 How It Works

### Story Flow

1. **Profile Creation**: Users create a profile with an avatar
2. **Chapter Selection**: Choose from available chapters (locked by prerequisites)
3. **Story Scenes**: Read narrative scenes with characters
4. **Code Challenges**: Help characters solve problems using Python
5. **Progress**: Track completed chapters, exercises, and achievements

### Code Execution

- Python code runs entirely in the browser using [Pyodide](https://pyodide.org/)
- No server-side execution needed
- 5-second timeout to prevent infinite loops
- Restricted module access for safety (no `os`, `sys`, network, etc.)

### State Management

Uses Svelte 5's reactive runes in `.svelte.ts` store files:

```typescript
// stores/user.svelte.ts
let currentUser = $state<UserProfile | null>(null)

export function getCurrentUser() {
  return currentUser
}

export function setCurrentUser(user: UserProfile) {
  currentUser = user
  saveToLocalStorage()
}
```

### Data Persistence

- All user data stored in browser `localStorage`
- Progress, achievements, and profiles persist across sessions
- No backend or database required

## 🎓 Learning Content

### Current Chapters

1. **Welcome to Python City** - Learn `print()` and variables
2. **Looping Around Town** - Master `for` loops and iteration
3. **Making Decisions** - Understand `if/elif/else` conditionals

### Concepts Covered

- Printing output
- Variables and assignment
- Strings and numbers
- For loops
- Lists and iteration
- Conditional statements (if/elif/else)
- Boolean logic

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run d           # Start dev server (shorthand)
bun run dev         # Start dev server

# Building
bun run b           # Build for production (shorthand)
bun run build       # Build for production

# Other
bun run p           # Preview production build
bun run preview     # Preview production build
bun run codegen     # Generate Panda CSS
bun run check       # Run TypeScript type checking
```

### Adding New Chapters

1. Edit `src/lib/content/story.ts`
2. Add chapter object with scenes
3. Include challenges with exercises
4. Set prerequisites if needed

### Adding New Achievements

1. Edit `src/lib/content/achievements.ts`
2. Add achievement definition
3. Trigger in `stores/progress.svelte.ts`

## 🤝 Contributing

This is an educational project. Feel free to:

- Fork and create your own Python stories
- Add new chapters and challenges
- Improve UI/UX
- Fix bugs or add features

## 📝 License

MIT License - feel free to use this for educational purposes.

## 🙏 Acknowledgments

- **Pyodide** - Python in WebAssembly
- **Svelte/SvelteKit** - Reactive UI framework
- **CodeMirror** - Code editor component
- **Panda CSS** - Type-safe CSS-in-JS

## 🐛 Known Issues

- Large Pyodide bundle (~15MB) requires initial load time
- Limited Python standard library support in browser
- Progress doesn't sync across devices (localStorage only)

## 🔮 Future Ideas

- More chapters and advanced Python concepts
- Multiplayer learning challenges
- Cloud sync for cross-device progress
- Teacher dashboard for classroom use
- Custom story creator

---

**Made with 💘 by the Crush AI assistant**



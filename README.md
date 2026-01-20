# Python Story

A web-based Python learning platform for children that teaches programming through interactive storytelling.

## Features

- **Interactive Storytelling**: Follow characters through a narrative adventure
- **Hands-on Coding**: Write real Python code in a browser-based editor
- **Progress Tracking**: Earn achievements and badges as you learn
- **Child-Friendly UI**: Designed for ages 8-14 with engaging visuals

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/mdrv/python-story.git
cd python-story
```

2. Install dependencies:
```bash
bun install
```

3. Generate CSS:
```bash
bun run codegen
```

4. Start the development server:
```bash
bun run dev
```

5. Open http://localhost:5173 in your browser

## Tech Stack

- **Framework**: SvelteKit with Svelte 5 (runes)
- **Language**: TypeScript
- **Runtime**: Bun
- **Styling**: Panda CSS
- **Code Editor**: CodeMirror 6
- **Python Runtime**: Pyodide (WebAssembly)

## Project Structure

```
src/
├── lib/
│   ├── content/          # Story data, lessons, achievements
│   ├── types.ts          # TypeScript interfaces
│   └── assets/           # Static assets
├── routes/               # SvelteKit routes
│   ├── story/           # Story viewer
│   ├── progress/         # Progress dashboard
│   └── +page.svelte     # Home/profile selection
├── stores/              # Svelte 5 stores (.svelte.ts)
│   ├── story.svelte.ts
│   ├── user.svelte.ts
│   ├── progress.svelte.ts
│   └── pyodide.svelte.ts
└── app.css              # Panda CSS entry point
```

## Contributing

This is an educational project. Feel free to fork and create your own Python stories!

## License

MIT License - feel free to use this for educational purposes.


# Quick Start Guide

Get up and running with the Rich Text Editor in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A code editor (VS Code recommended)

## Installation

### Option 1: Clone from GitHub

```bash
git clone https://github.com/yourusername/my-rich-text-editor.git
cd my-rich-text-editor
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Option 2: Docker (Recommended for Production)

```bash
git clone https://github.com/yourusername/my-rich-text-editor.git
cd my-rich-text-editor
docker-compose up --build
```

Open http://localhost:3000 in your browser.

## First Steps

### 1. Try the Editor

Once the app is running:
- Click in the editor area and start typing
- Select text and click formatting buttons (B, I, U)
- Try the heading buttons (H1, H2, H3)
- Use Ctrl+Z to undo and Ctrl+Y to redo

### 2. Explore the Code

Key files to check out:
- `src/components/RichTextEditor/RichTextEditor.jsx` - Main component
- `src/hooks/useEditorReducer.js` - State management
- `src/components/RichTextEditor/EditorToolbar.jsx` - Toolbar buttons

### 3. Run Tests

```bash
npm test
```

Watch the tests run and see the coverage report.

### 4. Customize

Edit `src/styles/Editor.module.css` to change colors, fonts, or layout.

Example - Change the primary color:
```css
:root {
  --primary-color: #ff6b6b; /* Change from blue to red */
}
```

## Common Tasks

### Add a New Toolbar Button

1. Open `src/components/RichTextEditor/EditorToolbar.jsx`
2. Add to `TOOLBAR_BUTTONS` array:

```javascript
{ 
  command: 'strikeThrough', 
  label: 'Strikethrough', 
  icon: 'S', 
  ariaLabel: 'Toggle strikethrough' 
}
```

### Change Initial Content

In `src/App.jsx`:

```javascript
<RichTextEditor 
  initialContent="<h1>Welcome!</h1><p>Your custom content here</p>"
/>
```

### Save Content to Backend

```javascript
const handleChange = async (content) => {
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ content }),
    headers: { 'Content-Type': 'application/json' }
  })
}

<RichTextEditor onChange={handleChange} />
```

### Add More History

In `src/hooks/useEditorReducer.js`, change:

```javascript
const MAX_HISTORY = 10 // Change to 20, 50, etc.
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Y | Redo |
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |
| Tab | Navigate toolbar |

## Troubleshooting

### Port Already in Use

If port 5173 is busy:
```bash
npm run dev -- --port 3001
```

### Tests Failing

Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npm test
```

### Docker Issues

Rebuild without cache:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Styling Not Updating

Hard refresh your browser:
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Check [API.md](API.md) for component API reference
3. Review [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions
4. See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- Open an issue on GitHub
- Check existing issues for solutions
- Review the test files for usage examples

## Quick Reference

### Project Structure
```
src/
├── components/       # React components
├── hooks/           # Custom hooks
├── contexts/        # Context providers
├── utils/           # Helper functions
├── styles/          # CSS files
└── tests/           # Test files
```

### Available Scripts
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Environment
- No environment variables required
- See `.env.example` for future configuration

## Success!

You're now ready to use and customize the Rich Text Editor. Happy coding! 🎉

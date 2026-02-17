# Rich Text Editor

A production-ready, feature-rich Rich Text Editor component built with React, featuring advanced state management using useReducer and Context API, comprehensive testing, and full accessibility support.

## Features

- **Rich Text Formatting**: Bold, Italic, Underline, and Headings (H1-H3)
- **Undo/Redo**: Robust history management with up to 10 actions
- **Advanced State Management**: Built with useReducer and Context API
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Responsive Design**: Optimized for mobile (375px), tablet, and desktop (1920px)
- **User Presence**: Simulated real-time user indicators
- **Error Boundaries**: Graceful error handling with fallback UI
- **Comprehensive Testing**: Unit and integration tests with Vitest and React Testing Library
- **Performance Optimized**: Throttled updates and memoized components

## Screenshots

### Desktop View
<img width="500" height="240" alt="TEXTEDITOR_GPP" src="https://github.com/user-attachments/assets/3ec85aba-fa07-4ccb-94a4-4dd90b00d8f0" />  <img width="500" height="240" alt="TEXTEDITOR2_GPP" src="https://github.com/user-attachments/assets/1b18f256-638f-46b6-8a3f-4fe42590e5b3" />



## Video Demo

Watch the full demonstration: 

The video showcases:
- Text editing and formatting
- Undo/Redo functionality
- Keyboard shortcuts
- Responsive behavior across devices
- Accessibility features

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-rich-text-editor.git
cd my-rich-text-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Docker Deployment

Build and run the application using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

To stop the container:
```bash
docker-compose down
```

## Usage

### Basic Implementation

```jsx
import RichTextEditor from './components/RichTextEditor/RichTextEditor'

function App() {
  const handleChange = (content) => {
    console.log('Editor content:', content)
  }

  return (
    <RichTextEditor 
      onChange={handleChange}
      initialContent="<p>Start typing...</p>"
    />
  )
}
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `function` | `undefined` | Callback fired when content changes (throttled to 300ms) |
| `initialContent` | `string` | `"<p>Start typing...</p>"` | Initial HTML content for the editor |

### Keyboard Shortcuts

- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y** or **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + B**: Bold (when text is selected)
- **Ctrl/Cmd + I**: Italic (when text is selected)
- **Ctrl/Cmd + U**: Underline (when text is selected)
- **Tab**: Navigate through toolbar buttons
- **Enter/Space**: Activate focused toolbar button

## Architecture

### State Management

The editor uses a sophisticated state management approach:

- **useReducer**: Manages complex state transitions for content, history, and selection
- **Context API**: Provides state and dispatch functions to nested components without prop drilling
- **Custom Hook**: `useEditorReducer` encapsulates reducer logic and provides convenient action creators

### State Structure

```javascript
{
  content: string,           // Current HTML content
  history: string[],         // Array of previous content states (max 10)
  historyPointer: number,    // Current position in history
  selection: Range | null    // Current text selection
}
```

### Component Architecture

```
RichTextEditor (Provider)
├── EditorToolbar
│   └── Toolbar buttons (Bold, Italic, etc.)
├── EditorContent
│   └── ContentEditable div
└── PresenceIndicators
    └── User presence list
```

### Key Design Decisions

1. **useReducer over useState**: Complex state transitions (undo/redo, history management) are better handled with a reducer pattern
2. **Context API**: Eliminates prop drilling for deeply nested toolbar buttons
3. **contentEditable**: Native browser API for rich text editing, providing built-in text manipulation
4. **Throttling**: onChange callbacks are throttled to 300ms to prevent excessive re-renders
5. **Memoization**: Components use React.memo and useCallback to optimize performance

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support with Tab navigation
- **ARIA Attributes**: 
  - `role="toolbar"` on toolbar
  - `role="textbox"` with `aria-multiline="true"` on editor
  - `aria-label` on all interactive elements
  - `aria-pressed` states on toggle buttons
- **Focus Management**: Visible focus indicators with proper contrast
- **Screen Reader Support**: Semantic HTML and descriptive labels
- **Color Contrast**: Meets WCAG 2.1 AA standards (4.5:1 for normal text)

## Testing Strategy

### Test Coverage

The project includes comprehensive testing at multiple levels:

#### Unit Tests
- **Reducer Logic** (`useEditorReducer.test.js`): Tests all state transitions
- **Utility Functions** (`editorUtils.test.js`): Tests helper functions like throttle and sanitization

#### Integration Tests
- **Component Rendering** (`RichTextEditor.test.jsx`): Verifies UI rendering
- **User Interactions**: Simulates typing, clicking, and keyboard shortcuts
- **Accessibility**: Validates ARIA attributes and keyboard navigation

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Results

```
Test Files  3 passed (3)
Tests  25 passed (25)
```

## Performance Optimizations

1. **React.memo**: Prevents unnecessary re-renders of toolbar and presence components
2. **useCallback**: Memoizes event handlers to maintain referential equality
3. **useMemo**: Caches expensive computations like throttled functions
4. **Throttling**: Limits onChange callback frequency to 300ms
5. **Lazy Loading**: Loading state prevents premature rendering

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
my-rich-text-editor/
├── public/
├── src/
│   ├── components/
│   │   ├── RichTextEditor/
│   │   │   ├── RichTextEditor.jsx
│   │   │   ├── EditorContent.jsx
│   │   │   ├── EditorToolbar.jsx
│   │   │   ├── PresenceIndicators.jsx
│   │   │   └── index.js
│   │   └── ErrorBoundary.jsx
│   ├── contexts/
│   │   └── EditorContext.jsx
│   ├── hooks/
│   │   └── useEditorReducer.js
│   ├── utils/
│   │   └── editorUtils.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   └── Editor.module.css
│   ├── tests/
│   │   ├── setup.js
│   │   ├── RichTextEditor.test.jsx
│   │   ├── useEditorReducer.test.js
│   │   └── editorUtils.test.js
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

## Future Enhancements

- Lists (ordered and unordered)
- Image insertion and management
- Link creation and editing
- Text alignment options
- Color picker for text and background
- Export to Markdown/PDF
- Real-time collaboration with WebSockets
- Autosave functionality
- Custom keyboard shortcuts



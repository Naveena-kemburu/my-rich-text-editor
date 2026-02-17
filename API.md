# API Documentation

## RichTextEditor Component

The main editor component that provides rich text editing capabilities.

### Props

#### `onChange`
- **Type**: `(content: string) => void`
- **Required**: No
- **Default**: `undefined`
- **Description**: Callback function that is called when the editor content changes. The callback receives the current HTML content as a string. This callback is throttled to 300ms to prevent excessive updates.

**Example**:
```jsx
const handleChange = (content) => {
  console.log('New content:', content)
  // Save to state, localStorage, or backend
}

<RichTextEditor onChange={handleChange} />
```

#### `initialContent`
- **Type**: `string`
- **Required**: No
- **Default**: `"<p>Start typing your content here...</p>"`
- **Description**: The initial HTML content to display in the editor when it first mounts.

**Example**:
```jsx
<RichTextEditor 
  initialContent="<h1>My Document</h1><p>Start here...</p>" 
/>
```

### Methods

The RichTextEditor component does not expose any public methods. All interactions are handled through props and user input.

### Events

#### Content Change
Triggered when the user modifies the editor content through typing, pasting, or formatting.

**Throttle**: 300ms

**Payload**: HTML string

#### Undo/Redo
Triggered when the user presses Ctrl/Cmd+Z (undo) or Ctrl/Cmd+Y (redo).

**History Limit**: 10 actions

## Context API

### EditorContext

Provides editor state and actions to child components.

#### Context Value

```typescript
{
  state: {
    content: string,
    history: string[],
    historyPointer: number,
    selection: Range | null
  },
  dispatch: (action: Action) => void,
  pushHistory: (content: string) => void,
  undo: () => void,
  redo: () => void,
  setSelection: (selection: Range | null) => void,
  setContent: (content: string) => void
}
```

#### Usage

```jsx
import { useEditorContext } from './contexts/EditorContext'

function CustomToolbarButton() {
  const { state, undo, redo } = useEditorContext()
  
  return (
    <button onClick={undo} disabled={state.historyPointer === 0}>
      Undo
    </button>
  )
}
```

## Hooks

### useEditorReducer

Custom hook that manages editor state using useReducer.

#### Parameters

- `initialContent` (string, optional): Initial content for the editor

#### Returns

```typescript
{
  state: EditorState,
  dispatch: Dispatch<Action>,
  pushHistory: (content: string) => void,
  undo: () => void,
  redo: () => void,
  setSelection: (selection: Range | null) => void,
  setContent: (content: string) => void
}
```

#### Example

```jsx
import { useEditorReducer } from './hooks/useEditorReducer'

function MyEditor() {
  const editor = useEditorReducer('<p>Initial content</p>')
  
  return (
    <div>
      <button onClick={editor.undo}>Undo</button>
      <button onClick={editor.redo}>Redo</button>
    </div>
  )
}
```

## Actions

### ACTIONS.SET_CONTENT

Sets the editor content without affecting history.

**Payload**: `string` (HTML content)

**Example**:
```javascript
dispatch({ type: ACTIONS.SET_CONTENT, payload: '<p>New content</p>' })
```

### ACTIONS.PUSH_HISTORY

Adds content to history and updates the current content.

**Payload**: `string` (HTML content)

**Example**:
```javascript
dispatch({ type: ACTIONS.PUSH_HISTORY, payload: '<p>New content</p>' })
```

### ACTIONS.UNDO

Moves back in history and restores previous content.

**Payload**: None

**Example**:
```javascript
dispatch({ type: ACTIONS.UNDO })
```

### ACTIONS.REDO

Moves forward in history and restores next content.

**Payload**: None

**Example**:
```javascript
dispatch({ type: ACTIONS.REDO })
```

### ACTIONS.SET_SELECTION

Updates the current text selection.

**Payload**: `Range | null`

**Example**:
```javascript
dispatch({ type: ACTIONS.SET_SELECTION, payload: selectionRange })
```

## Utility Functions

### applyStyle

Applies a formatting style to the current selection.

**Parameters**:
- `command` (string): The formatting command (e.g., 'bold', 'italic')
- `value` (string | null, optional): Value for the command (e.g., 'h1' for formatBlock)

**Example**:
```javascript
import { applyStyle } from './utils/editorUtils'

applyStyle('bold')
applyStyle('formatBlock', 'h1')
```

### saveSelection

Saves the current text selection.

**Returns**: `Range | null`

**Example**:
```javascript
import { saveSelection } from './utils/editorUtils'

const selection = saveSelection()
```

### restoreSelection

Restores a previously saved selection.

**Parameters**:
- `range` (Range | null): The selection range to restore

**Example**:
```javascript
import { restoreSelection } from './utils/editorUtils'

restoreSelection(savedRange)
```

### sanitizeHtml

Sanitizes HTML content to prevent XSS attacks.

**Parameters**:
- `html` (string): HTML content to sanitize

**Returns**: `string` (sanitized HTML)

**Example**:
```javascript
import { sanitizeHtml } from './utils/editorUtils'

const clean = sanitizeHtml('<p>User input</p>')
```

### throttle

Creates a throttled version of a function.

**Parameters**:
- `func` (Function): Function to throttle
- `delay` (number): Delay in milliseconds

**Returns**: Throttled function

**Example**:
```javascript
import { throttle } from './utils/editorUtils'

const throttledSave = throttle(saveContent, 1000)
```

## Styling

### CSS Classes

The editor uses the following CSS classes that can be customized:

- `.rich-text-editor`: Main container
- `.editor-toolbar`: Toolbar container
- `.toolbar-button`: Individual toolbar button
- `.toolbar-button.active`: Active/pressed button state
- `.editor-content`: Editable content area
- `.presence-indicators`: User presence container
- `.presence-indicator`: Individual user indicator
- `.editor-loading`: Loading state container

### Custom Styling Example

```css
.rich-text-editor {
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.toolbar-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.editor-content {
  font-family: 'Georgia', serif;
  font-size: 18px;
}
```

## Accessibility

### ARIA Attributes

The editor implements the following ARIA attributes:

- `role="toolbar"` on toolbar
- `role="textbox"` on content area
- `aria-multiline="true"` on content area
- `aria-label` on all interactive elements
- `aria-pressed` on toggle buttons
- `role="status"` on presence indicators

### Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Navigate to next toolbar button |
| Shift+Tab | Navigate to previous toolbar button |
| Enter/Space | Activate focused button |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Y | Redo |
| Ctrl/Cmd+Shift+Z | Redo (alternative) |
| Ctrl/Cmd+B | Bold (browser default) |
| Ctrl/Cmd+I | Italic (browser default) |
| Ctrl/Cmd+U | Underline (browser default) |

## Error Handling

### ErrorBoundary

The editor is wrapped in an ErrorBoundary component that catches JavaScript errors.

**Fallback UI**: Displays error message with option to view details

**Error Logging**: Errors are logged to console

**Example**:
```jsx
import ErrorBoundary from './components/ErrorBoundary'
import RichTextEditor from './components/RichTextEditor'

function App() {
  return (
    <ErrorBoundary>
      <RichTextEditor />
    </ErrorBoundary>
  )
}
```

## Performance

### Optimization Techniques

1. **Memoization**: Components use React.memo to prevent unnecessary re-renders
2. **Throttling**: onChange callbacks are throttled to 300ms
3. **useCallback**: Event handlers are memoized
4. **useMemo**: Expensive computations are cached

### Performance Tips

- Avoid passing new object/array references as props
- Use the provided throttled onChange callback
- Keep parent component updates minimal
- Consider debouncing external API calls

## Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### Known Limitations

- `contentEditable` behavior may vary slightly between browsers
- Some keyboard shortcuts may conflict with browser defaults
- Mobile browsers may have different selection behavior

## TypeScript Support

While this project is written in JavaScript, TypeScript definitions can be added:

```typescript
interface RichTextEditorProps {
  onChange?: (content: string) => void
  initialContent?: string
}

interface EditorState {
  content: string
  history: string[]
  historyPointer: number
  selection: Range | null
}

type Action = 
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'PUSH_HISTORY'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_SELECTION'; payload: Range | null }
```

## Examples

### Basic Usage

```jsx
import RichTextEditor from './components/RichTextEditor'

function App() {
  return <RichTextEditor />
}
```

### With State Management

```jsx
import { useState } from 'react'
import RichTextEditor from './components/RichTextEditor'

function App() {
  const [content, setContent] = useState('')

  return (
    <div>
      <RichTextEditor onChange={setContent} />
      <div>Character count: {content.length}</div>
    </div>
  )
}
```

### With LocalStorage

```jsx
import { useState, useEffect } from 'react'
import RichTextEditor from './components/RichTextEditor'

function App() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('editor-content') || ''
  })

  useEffect(() => {
    localStorage.setItem('editor-content', content)
  }, [content])

  return <RichTextEditor onChange={setContent} initialContent={content} />
}
```

### Multiple Editors

```jsx
import RichTextEditor from './components/RichTextEditor'

function App() {
  return (
    <div>
      <h2>Editor 1</h2>
      <RichTextEditor initialContent="<p>First editor</p>" />
      
      <h2>Editor 2</h2>
      <RichTextEditor initialContent="<p>Second editor</p>" />
    </div>
  )
}
```

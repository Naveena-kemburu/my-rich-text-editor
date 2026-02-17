# Architecture Documentation

## Overview

This document provides an in-depth look at the architectural decisions and patterns used in the Rich Text Editor component.

## State Management Architecture

### Why useReducer?

The editor uses `useReducer` instead of `useState` for several key reasons:

1. **Complex State Transitions**: The editor manages multiple related pieces of state (content, history, pointer)
2. **Predictable Updates**: Reducer pattern ensures state updates follow a predictable pattern
3. **Easier Testing**: Pure reducer functions are easy to test in isolation
4. **Better Performance**: Single dispatch can update multiple state values atomically

### State Flow Diagram

```
User Action (typing, clicking)
        ↓
Event Handler (onInput, onClick)
        ↓
Dispatch Action (PUSH_HISTORY, UNDO, etc.)
        ↓
Reducer Function (editorReducer)
        ↓
New State
        ↓
Context Update
        ↓
Component Re-render
```

### History Management

The undo/redo system uses a history array with a pointer:

```javascript
history: ['state1', 'state2', 'state3', 'state4']
                              ↑
                        historyPointer: 2
```

- **UNDO**: Moves pointer left, restores previous state
- **REDO**: Moves pointer right, restores next state
- **New Action**: Truncates history after pointer, adds new state

## Component Communication

### Context API Pattern

```
EditorContext.Provider (RichTextEditor)
├── value: { state, dispatch, actions }
├── EditorToolbar (Consumer)
│   └── Uses: undo, redo, state.historyPointer
├── EditorContent (Consumer)
│   └── Uses: state.content, pushHistory
└── PresenceIndicators (Independent)
```

Benefits:
- No prop drilling through multiple levels
- Clean component interfaces
- Easy to add new consumers

## Performance Optimizations

### 1. Memoization Strategy

```javascript
// Component memoization
export default React.memo(EditorToolbar)

// Callback memoization
const handleInput = useCallback(() => {
  // Handler logic
}, [dependencies])

// Value memoization
const throttledOnChange = useMemo(
  () => throttle(onChange, 300),
  [onChange]
)
```

### 2. Throttling Pattern

The onChange callback is throttled to prevent excessive parent re-renders:

```
User types: a b c d e f g
            ↓ ↓ ↓ ↓ ↓ ↓ ↓
Throttle:   ↓     ↓     ↓
onChange:   a     d     g
```

### 3. Selective Re-renders

- Toolbar only re-renders when history changes
- Content only re-renders when content changes
- Presence indicators update independently

## Accessibility Architecture

### Keyboard Navigation Flow

```
Tab → Bold Button → Italic Button → ... → Undo → Redo
                                              ↓
                                        Shift+Tab (reverse)
```

### ARIA Hierarchy

```
toolbar (role="toolbar")
├── button (role="button", aria-pressed)
├── button (role="button", aria-pressed)
└── ...

textbox (role="textbox", aria-multiline="true")
```

### Focus Management

1. Toolbar buttons have `tabIndex={0}`
2. Editor content is naturally focusable (contentEditable)
3. Focus indicators use CSS `:focus` with high contrast

## Testing Architecture

### Test Pyramid

```
        /\
       /  \
      / E2E \  (Future: Playwright)
     /______\
    /        \
   /Integration\ (React Testing Library)
  /____________\
 /              \
/  Unit Tests    \ (Vitest)
/________________\
```

### Current Coverage

- **Unit Tests**: Reducer logic, utility functions
- **Integration Tests**: Component rendering, user interactions
- **Future**: End-to-end tests with Playwright

### Testing Patterns

1. **Arrange-Act-Assert**: Standard test structure
2. **User-Centric**: Tests simulate real user behavior
3. **Accessibility**: Tests verify ARIA attributes and keyboard nav

## Error Handling Strategy

### Error Boundary Pattern

```
App
└── ErrorBoundary
    └── RichTextEditor
        ├── EditorToolbar
        ├── EditorContent
        └── PresenceIndicators
```

Benefits:
- Prevents entire app crash
- Provides user-friendly error UI
- Logs errors for debugging

### Error Recovery

1. **Graceful Degradation**: Editor shows error UI but app continues
2. **Error Logging**: Errors logged to console for debugging
3. **User Feedback**: Clear message with option to refresh

## Data Flow

### Content Update Flow

```
1. User types in EditorContent
2. onInput event fires
3. pushHistory(newContent) dispatched
4. Reducer updates state
5. Context notifies consumers
6. EditorContent re-renders with new content
7. Throttled onChange notifies parent
```

### Style Application Flow

```
1. User clicks Bold button
2. applyStyle('bold') called
3. document.execCommand modifies DOM
4. Selection change triggers state update
5. Button shows active state
```

## Responsive Design Strategy

### Breakpoints

- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Adaptive Features

1. **Toolbar**: Smaller buttons on mobile
2. **Editor**: Reduced padding on small screens
3. **Presence**: Stacks vertically on mobile
4. **Font Sizes**: Scale down on mobile

## Security Considerations

### XSS Prevention

1. **Content Sanitization**: HTML is sanitized before rendering
2. **No eval()**: No dynamic code execution
3. **CSP Ready**: Compatible with Content Security Policy

### Input Validation

- Content is always treated as HTML, not executable code
- Paste events strip formatting to prevent malicious content

## Deployment Architecture

### Docker Multi-Stage Build

```
Stage 1: Build
- Install dependencies
- Build production bundle
- Optimize assets

Stage 2: Production
- Nginx server
- Serve static files
- Gzip compression
```

### Benefits

- Small image size
- Fast startup
- Production-optimized
- Easy to deploy anywhere

## Future Architecture Considerations

### Real-Time Collaboration

```
Client 1 ←→ WebSocket Server ←→ Client 2
    ↓              ↓              ↓
Operational Transform (OT) or CRDT
```

### Plugin System

```javascript
const editor = useEditor({
  plugins: [
    imagePlugin,
    linkPlugin,
    markdownPlugin
  ]
})
```

### State Persistence

```javascript
// LocalStorage
useEffect(() => {
  localStorage.setItem('editor-content', state.content)
}, [state.content])

// IndexedDB for larger content
// Backend sync for multi-device
```

## Conclusion

This architecture prioritizes:
- **Maintainability**: Clear separation of concerns
- **Performance**: Optimized re-renders and updates
- **Accessibility**: WCAG 2.1 AA compliance
- **Testability**: Easy to test at all levels
- **Scalability**: Ready for future enhancements

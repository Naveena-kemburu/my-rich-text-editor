import React, { useCallback, useState, useEffect } from 'react'
import { useEditorContext } from '../../contexts/EditorContext'
import { applyStyle, isStyleActive } from '../../utils/editorUtils'

const TOOLBAR_BUTTONS = [
  { command: 'bold', label: 'Bold', icon: 'B', ariaLabel: 'Toggle bold', type: 'format', tooltip: 'Bold (Ctrl+B)' },
  { command: 'italic', label: 'Italic', icon: 'I', ariaLabel: 'Toggle italic', type: 'format', tooltip: 'Italic (Ctrl+I)' },
  { command: 'underline', label: 'Underline', icon: 'U', ariaLabel: 'Toggle underline', type: 'format', tooltip: 'Underline (Ctrl+U)' },
  { command: 'formatBlock', value: 'h1', label: 'H1', icon: 'H1', ariaLabel: 'Heading 1', type: 'heading', tooltip: 'Heading 1 (applies to entire paragraph)' },
  { command: 'formatBlock', value: 'h2', label: 'H2', icon: 'H2', ariaLabel: 'Heading 2', type: 'heading', tooltip: 'Heading 2 (applies to entire paragraph)' },
  { command: 'formatBlock', value: 'h3', label: 'H3', icon: 'H3', ariaLabel: 'Heading 3', type: 'heading', tooltip: 'Heading 3 (applies to entire paragraph)' },
]

function EditorToolbar() {
  const { undo, redo, state } = useEditorContext()
  const [activeStyles, setActiveStyles] = useState({})

  const canUndo = state.historyPointer > 0
  const canRedo = state.historyPointer < state.history.length - 1

  const updateActiveStyles = useCallback(() => {
    const styles = {}
    TOOLBAR_BUTTONS.forEach(button => {
      if (button.command !== 'formatBlock') {
        styles[button.command] = isStyleActive(button.command)
      }
    })
    setActiveStyles(styles)
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', updateActiveStyles)
    return () => {
      document.removeEventListener('selectionchange', updateActiveStyles)
    }
  }, [updateActiveStyles])

  const handleStyleClick = useCallback((command, value) => {
    applyStyle(command, value)
    updateActiveStyles()
  }, [updateActiveStyles])

  const handleKeyDown = useCallback((e, command, value) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleStyleClick(command, value)
    }
  }, [handleStyleClick])

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Text formatting toolbar">
      <div className="toolbar-group">
        {TOOLBAR_BUTTONS.map((button) => (
          <button
            key={button.label}
            className={`toolbar-button toolbar-button-${button.type} ${activeStyles[button.command] ? 'active' : ''}`}
            onClick={() => handleStyleClick(button.command, button.value)}
            onKeyDown={(e) => handleKeyDown(e, button.command, button.value)}
            aria-label={button.ariaLabel}
            aria-pressed={activeStyles[button.command] || false}
            title={button.tooltip}
            tabIndex={0}
          >
            {button.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
          tabIndex={0}
        >
          ↶
        </button>
        <button
          className="toolbar-button"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo (Ctrl+Y)"
          tabIndex={0}
        >
          ↷
        </button>
      </div>
    </div>
  )
}

export default React.memo(EditorToolbar)

import React, { useRef, useEffect, useCallback } from 'react'
import { useEditorContext } from '../../contexts/EditorContext'
import { saveSelection } from '../../utils/editorUtils'

function EditorContent() {
  const { state, pushHistory, setSelection, undo, redo } = useEditorContext()
  const contentRef = useRef(null)
  const isUpdatingRef = useRef(false)

  useEffect(() => {
    if (contentRef.current && !isUpdatingRef.current) {
      const selection = saveSelection()
      contentRef.current.innerHTML = state.content
      
      if (selection) {
        try {
          const windowSelection = window.getSelection()
          windowSelection.removeAllRanges()
          windowSelection.addRange(selection)
        } catch (e) {
          console.warn('Could not restore selection:', e)
        }
      }
    }
    isUpdatingRef.current = false
  }, [state.content])

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      isUpdatingRef.current = true
      const newContent = contentRef.current.innerHTML
      pushHistory(newContent)
      setSelection(saveSelection())
    }
  }, [pushHistory, setSelection])

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        redo()
      } else {
        undo()
      }
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault()
      redo()
    }
  }, [undo, redo])

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }, [])

  return (
    <div
      ref={contentRef}
      className="editor-content"
      contentEditable={true}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      role="textbox"
      aria-multiline="true"
      aria-label="Rich text editor content area"
      suppressContentEditableWarning={true}
    />
  )
}

export default React.memo(EditorContent)

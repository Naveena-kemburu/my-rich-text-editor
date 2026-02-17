import React, { useEffect, useState, useMemo } from 'react'
import { EditorContext } from '../../contexts/EditorContext'
import { useEditorReducer } from '../../hooks/useEditorReducer'
import EditorToolbar from './EditorToolbar'
import EditorContent from './EditorContent'
import PresenceIndicators from './PresenceIndicators'
import { throttle } from '../../utils/editorUtils'
import '../../styles/Editor.css'

function RichTextEditor({ onChange, initialContent }) {
  const [isLoading, setIsLoading] = useState(true)
  const editorState = useEditorReducer(initialContent)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const throttledOnChange = useMemo(
    () => throttle((content) => {
      if (onChange) {
        onChange(content)
      }
    }, 300),
    [onChange]
  )

  useEffect(() => {
    throttledOnChange(editorState.state.content)
  }, [editorState.state.content, throttledOnChange])

  if (isLoading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>Loading editor...</p>
      </div>
    )
  }

  return (
    <EditorContext.Provider value={editorState}>
      <div className="rich-text-editor">
        <EditorToolbar />
        <EditorContent />
        <PresenceIndicators />
      </div>
    </EditorContext.Provider>
  )
}

export default RichTextEditor

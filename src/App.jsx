import React, { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import RichTextEditor from './components/RichTextEditor/RichTextEditor'
import './styles/App.css'

function App() {
  const [content, setContent] = useState('')

  const handleChange = (newContent) => {
    setContent(newContent)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rich Text Editor</h1>
        <p>A production-ready editor with advanced state management</p>
      </header>
      
      <main className="app-main">
        <ErrorBoundary>
          <RichTextEditor 
            onChange={handleChange}
            initialContent="<p>Start typing your content here...</p>"
          />
        </ErrorBoundary>
      </main>

      <footer className="app-footer">
        <p>Built with React, useReducer, and Context API</p>
      </footer>
    </div>
  )
}

export default App

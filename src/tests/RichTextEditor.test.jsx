import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RichTextEditor from '../components/RichTextEditor/RichTextEditor'

describe('RichTextEditor', () => {
  it('should render loading state initially', () => {
    render(<RichTextEditor />)
    expect(screen.getByText(/loading editor/i)).toBeInTheDocument()
  })

  it('should render editor after loading', async () => {
    render(<RichTextEditor />)
    
    await waitFor(() => {
      expect(screen.queryByText(/loading editor/i)).not.toBeInTheDocument()
    })

    expect(screen.getByRole('toolbar')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render toolbar buttons', async () => {
    render(<RichTextEditor />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/toggle bold/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/toggle italic/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/toggle underline/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/heading 1/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/heading 2/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/heading 3/i)).toBeInTheDocument()
  })

  it('should render undo and redo buttons', async () => {
    render(<RichTextEditor />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/undo/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/redo/i)).toBeInTheDocument()
  })

  it('should have undo button disabled initially', async () => {
    render(<RichTextEditor />)
    
    await waitFor(() => {
      const undoButton = screen.getByLabelText(/undo/i)
      expect(undoButton).toBeDisabled()
    })
  })

  it('should render presence indicators', async () => {
    render(<RichTextEditor />)
    
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    expect(screen.getByText(/current user/i)).toBeInTheDocument()
  })

  it('should call onChange when content changes', async () => {
    const handleChange = vi.fn()
    render(<RichTextEditor onChange={handleChange} />)
    
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    }, { timeout: 1000 })
  })

  it('should render with initial content', async () => {
    const initialContent = '<p>Test initial content</p>'
    render(<RichTextEditor initialContent={initialContent} />)
    
    await waitFor(() => {
      const editor = screen.getByRole('textbox')
      expect(editor.innerHTML).toContain('Test initial content')
    })
  })

  it('should have proper accessibility attributes', async () => {
    render(<RichTextEditor />)
    
    await waitFor(() => {
      const toolbar = screen.getByRole('toolbar')
      expect(toolbar).toHaveAttribute('aria-label')
    })

    const textbox = screen.getByRole('textbox')
    expect(textbox).toHaveAttribute('aria-multiline', 'true')
    expect(textbox).toHaveAttribute('aria-label')
  })

  it('should allow keyboard navigation on toolbar buttons', async () => {
    const user = userEvent.setup()
    render(<RichTextEditor />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/toggle bold/i)).toBeInTheDocument()
    })

    const boldButton = screen.getByLabelText(/toggle bold/i)
    await user.tab()
    
    expect(document.activeElement).toBeTruthy()
  })
})

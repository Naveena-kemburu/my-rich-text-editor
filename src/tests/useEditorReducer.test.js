import { describe, it, expect } from 'vitest'
import { editorReducer, ACTIONS, initialState } from '../hooks/useEditorReducer'

describe('editorReducer', () => {
  describe('SET_CONTENT', () => {
    it('should set content without affecting history', () => {
      const newContent = '<p>New content</p>'
      const action = { type: ACTIONS.SET_CONTENT, payload: newContent }
      const result = editorReducer(initialState, action)

      expect(result.content).toBe(newContent)
      expect(result.history).toEqual(initialState.history)
      expect(result.historyPointer).toBe(initialState.historyPointer)
    })
  })

  describe('PUSH_HISTORY', () => {
    it('should add content to history and update pointer', () => {
      const newContent = '<p>New content</p>'
      const action = { type: ACTIONS.PUSH_HISTORY, payload: newContent }
      const result = editorReducer(initialState, action)

      expect(result.content).toBe(newContent)
      expect(result.history).toContain(newContent)
      expect(result.historyPointer).toBe(result.history.length - 1)
    })

    it('should limit history to MAX_HISTORY items', () => {
      let state = { ...initialState, history: [], historyPointer: -1 }
      
      for (let i = 0; i < 12; i++) {
        const action = { type: ACTIONS.PUSH_HISTORY, payload: `<p>Content ${i}</p>` }
        state = editorReducer(state, action)
      }

      expect(state.history.length).toBeLessThanOrEqual(10)
    })

    it('should clear redo history when pushing after undo', () => {
      let state = { ...initialState, history: ['a', 'b', 'c'], historyPointer: 2 }
      
      state = editorReducer(state, { type: ACTIONS.UNDO })
      expect(state.historyPointer).toBe(1)
      
      state = editorReducer(state, { type: ACTIONS.PUSH_HISTORY, payload: 'd' })
      expect(state.history).toEqual(['a', 'b', 'd'])
      expect(state.historyPointer).toBe(2)
    })
  })

  describe('UNDO', () => {
    it('should move pointer back and restore previous content', () => {
      const state = {
        ...initialState,
        content: '<p>Current</p>',
        history: ['<p>First</p>', '<p>Second</p>', '<p>Current</p>'],
        historyPointer: 2
      }

      const result = editorReducer(state, { type: ACTIONS.UNDO })

      expect(result.historyPointer).toBe(1)
      expect(result.content).toBe('<p>Second</p>')
    })

    it('should not undo when at the beginning of history', () => {
      const state = {
        ...initialState,
        content: '<p>First</p>',
        history: ['<p>First</p>'],
        historyPointer: 0
      }

      const result = editorReducer(state, { type: ACTIONS.UNDO })

      expect(result.historyPointer).toBe(0)
      expect(result.content).toBe('<p>First</p>')
    })
  })

  describe('REDO', () => {
    it('should move pointer forward and restore next content', () => {
      const state = {
        ...initialState,
        content: '<p>First</p>',
        history: ['<p>First</p>', '<p>Second</p>', '<p>Third</p>'],
        historyPointer: 0
      }

      const result = editorReducer(state, { type: ACTIONS.REDO })

      expect(result.historyPointer).toBe(1)
      expect(result.content).toBe('<p>Second</p>')
    })

    it('should not redo when at the end of history', () => {
      const state = {
        ...initialState,
        content: '<p>Last</p>',
        history: ['<p>First</p>', '<p>Last</p>'],
        historyPointer: 1
      }

      const result = editorReducer(state, { type: ACTIONS.REDO })

      expect(result.historyPointer).toBe(1)
      expect(result.content).toBe('<p>Last</p>')
    })
  })

  describe('SET_SELECTION', () => {
    it('should update selection state', () => {
      const selection = { start: 0, end: 5 }
      const action = { type: ACTIONS.SET_SELECTION, payload: selection }
      const result = editorReducer(initialState, action)

      expect(result.selection).toEqual(selection)
    })
  })

  describe('Unknown action', () => {
    it('should return current state for unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION' }
      const result = editorReducer(initialState, action)

      expect(result).toEqual(initialState)
    })
  })
})

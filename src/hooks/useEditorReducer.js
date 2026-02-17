import { useReducer, useCallback } from 'react'

const MAX_HISTORY = 10

export const ACTIONS = {
  SET_CONTENT: 'SET_CONTENT',
  APPLY_STYLE: 'APPLY_STYLE',
  UNDO: 'UNDO',
  REDO: 'REDO',
  SET_SELECTION: 'SET_SELECTION',
  PUSH_HISTORY: 'PUSH_HISTORY'
}

export const initialState = {
  content: '<p>Start typing your content here...</p>',
  history: [],
  historyPointer: -1,
  selection: null
}

export function editorReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CONTENT: {
      return {
        ...state,
        content: action.payload
      }
    }

    case ACTIONS.PUSH_HISTORY: {
      const newHistory = state.history.slice(0, state.historyPointer + 1)
      newHistory.push(action.payload)
      
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift()
      }

      return {
        ...state,
        content: action.payload,
        history: newHistory,
        historyPointer: newHistory.length - 1
      }
    }

    case ACTIONS.UNDO: {
      if (state.historyPointer > 0) {
        const newPointer = state.historyPointer - 1
        return {
          ...state,
          content: state.history[newPointer],
          historyPointer: newPointer
        }
      }
      return state
    }

    case ACTIONS.REDO: {
      if (state.historyPointer < state.history.length - 1) {
        const newPointer = state.historyPointer + 1
        return {
          ...state,
          content: state.history[newPointer],
          historyPointer: newPointer
        }
      }
      return state
    }

    case ACTIONS.SET_SELECTION: {
      return {
        ...state,
        selection: action.payload
      }
    }

    default:
      return state
  }
}

export function useEditorReducer(initialContent) {
  const customInitialState = {
    ...initialState,
    content: initialContent || initialState.content,
    history: [initialContent || initialState.content],
    historyPointer: 0
  }

  const [state, dispatch] = useReducer(editorReducer, customInitialState)

  const pushHistory = useCallback((content) => {
    dispatch({ type: ACTIONS.PUSH_HISTORY, payload: content })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: ACTIONS.REDO })
  }, [])

  const setSelection = useCallback((selection) => {
    dispatch({ type: ACTIONS.SET_SELECTION, payload: selection })
  }, [])

  const setContent = useCallback((content) => {
    dispatch({ type: ACTIONS.SET_CONTENT, payload: content })
  }, [])

  return {
    state,
    dispatch,
    pushHistory,
    undo,
    redo,
    setSelection,
    setContent
  }
}

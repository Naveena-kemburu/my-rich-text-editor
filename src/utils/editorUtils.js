export function applyStyle(command, value = null) {
  document.execCommand(command, false, value)
}

export function saveSelection() {
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0)
  }
  return null
}

export function restoreSelection(range) {
  if (range) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export function getSelectionHtml() {
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const clonedSelection = range.cloneContents()
    const div = document.createElement('div')
    div.appendChild(clonedSelection)
    return div.innerHTML
  }
  return ''
}

export function isStyleActive(command) {
  return document.queryCommandState(command)
}

export function sanitizeHtml(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.innerHTML
}

export function throttle(func, delay) {
  let timeoutId
  let lastRan
  return function (...args) {
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(function () {
        if (Date.now() - lastRan >= delay) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, delay - (Date.now() - lastRan))
    }
  }
}

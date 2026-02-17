import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sanitizeHtml, throttle } from '../utils/editorUtils'

describe('editorUtils', () => {
  describe('sanitizeHtml', () => {
    it('should return sanitized HTML', () => {
      const html = '<p>Hello <strong>World</strong></p>'
      const result = sanitizeHtml(html)
      expect(result).toBe('<p>Hello <strong>World</strong></p>')
    })

    it('should handle empty string', () => {
      const result = sanitizeHtml('')
      expect(result).toBe('')
    })

    it('should preserve basic HTML tags', () => {
      const html = '<h1>Title</h1><p>Paragraph</p>'
      const result = sanitizeHtml(html)
      expect(result).toContain('<h1>')
      expect(result).toContain('<p>')
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should call function immediately on first invocation', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 1000)

      throttled()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should throttle subsequent calls', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 1000)

      throttled()
      throttled()
      throttled()

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should call function after delay', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 1000)

      throttled()
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(500)
      throttled()
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments to throttled function', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 1000)

      throttled('arg1', 'arg2')
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })
})

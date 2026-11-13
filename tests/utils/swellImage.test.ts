import { describe, expect, it } from 'vitest'
import { withSwellImageWidth } from '~/utils/swellImage'

describe('withSwellImageWidth', () => {
  it('adds the requested width while preserving the image URL', () => {
    expect(withSwellImageWidth('https://cdn.swell.store/store/image.jpg', 400))
      .toBe('https://cdn.swell.store/store/image.jpg?width=400')
  })

  it('preserves existing query parameters', () => {
    expect(withSwellImageWidth('https://cdn.swell.store/store/image.jpg?token=abc', 750))
      .toBe('https://cdn.swell.store/store/image.jpg?token=abc&width=750')
  })

  it('returns missing or invalid URLs without throwing', () => {
    expect(withSwellImageWidth(undefined, 400)).toBeUndefined()
    expect(withSwellImageWidth('not-a-url', 400)).toBe('not-a-url')
  })
})

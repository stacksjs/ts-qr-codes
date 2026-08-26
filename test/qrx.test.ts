import { describe, expect, it } from 'bun:test'
import { QRErrorCorrectLevel, toMatrix, toSvg, toTerminal } from '../packages/ts-qr-codes/src'

describe('qrx', () => {
  it('should export QRErrorCorrectLevel', () => {
    expect(QRErrorCorrectLevel).toBeDefined()
    expect(QRErrorCorrectLevel.L).toBe(1)
    expect(QRErrorCorrectLevel.M).toBe(0)
    expect(QRErrorCorrectLevel.Q).toBe(3)
    expect(QRErrorCorrectLevel.H).toBe(2)
  })
})

describe('encoding without a DOM', () => {
  it('returns a square matrix of the right size for the version', () => {
    const matrix = toMatrix('HELLO')
    expect(matrix.length).toBeGreaterThan(0)
    // A version-N code is 4N+17 modules square.
    expect((matrix.length - 17) % 4).toBe(0)
    for (const row of matrix) expect(row.length).toBe(matrix.length)
  })

  it('grows with the content rather than truncating it', () => {
    expect(toMatrix('x'.repeat(200)).length).toBeGreaterThan(toMatrix('x').length)
  })

  /**
   * The capacity table used to stop at version 5 -- five rows and a "truncated
   * for brevity" comment where the other thirty-five belonged -- so anything
   * over 106 characters threw `Too long data`. The Reed-Solomon and alignment
   * tables were complete the whole time, so the encoder could always have done
   * this.
   */
  it('encodes past version 5, which the rest of the encoder always supported', () => {
    const matrix = toMatrix('x'.repeat(900))
    const version = (matrix.length - 17) / 4
    expect(version).toBeGreaterThan(5)
  })

  it('still refuses data no version can hold', () => {
    expect(() => toMatrix('x'.repeat(5000))).toThrow(/Too long/)
  })
})

/**
 * The finder patterns are what a scanner looks for first, and they are what
 * this package got wrong: both branches of the assignment in
 * `setupPositionProbePattern` wrote `true`, so the whole 8x8 region came out
 * solid -- no ring, no separator. Nothing threw and every renderer drew it
 * happily; the codes simply could not be read. Asserted structurally here
 * because a solid block passes any test that only checks for "some dark
 * modules".
 */
describe('finder patterns', () => {
  const ring = [
    '#######.',
    '#.....#.',
    '#.###.#.',
    '#.###.#.',
    '#.###.#.',
    '#.....#.',
    '#######.',
    '........',
  ]

  it('draws a ring with a separator, not a solid block', () => {
    const matrix = toMatrix('HELLO')
    const at = (r: number, c: number): string => (matrix[r]![c] ? '#' : '.')

    for (let r = 0; r < 8; r++) {
      let row = ''
      for (let c = 0; c < 8; c++) row += at(r, c)
      expect(row).toBe(ring[r]!)
    }
  })

  it('puts one in each of the three corners', () => {
    const matrix = toMatrix('HELLO')
    const size = matrix.length
    // Top-right and bottom-left, mirrored, each with its separator.
    expect(matrix[0]!.slice(size - 7).every(Boolean)).toBe(true)
    expect(matrix[0]![size - 8]).toBe(false)
    expect(matrix.slice(size - 7).every(row => row[0])).toBe(true)
    expect(matrix[size - 8]![0]).toBe(false)
  })

  it('sets the dark module the specification requires', () => {
    // Always dark, at (4 * version + 9, 8) -- a scanner uses it to orient.
    const matrix = toMatrix('HELLO')
    const version = (matrix.length - 17) / 4
    expect(matrix[4 * version + 9]![8]).toBe(true)
  })
})

describe('the timing patterns', () => {
  it('alternate, which is how a scanner measures the module size', () => {
    const matrix = toMatrix('HELLO')
    for (let c = 8; c < matrix.length - 8; c++)
      expect(matrix[6]![c]).toBe(c % 2 === 0)
    for (let r = 8; r < matrix.length - 8; r++)
      expect(matrix[r]![6]).toBe(r % 2 === 0)
  })
})

describe('rendering to a terminal', () => {
  it('surrounds the code with a quiet zone, without which scanners fail', () => {
    const lines = toTerminal('HELLO').split('\n')
    // Two module rows per line, so four modules of margin is two full lines.
    expect(lines[0]).toContain('█'.repeat(20))
    expect(lines.at(-1)).toContain('█'.repeat(20))
  })

  it('is half the height of the module count, give or take the odd row', () => {
    const matrix = toMatrix('HELLO')
    const lines = toTerminal('HELLO', { margin: 4 }).split('\n')
    expect(lines.length).toBe(Math.ceil((matrix.length + 8) / 2))
  })
})

/**
 * The renderer most uses of a QR code actually want — a membership card, an
 * email, a server-rendered page — and the one the library did not have. Anyone
 * needing it was encoding the matrix and writing the markup by hand, or
 * installing a second QR library beside this one to do it.
 */
describe('toSvg', () => {
  const modules = (svg: string): number => Number(svg.match(/viewBox="0 0 (\d+)/)![1])

  it('sizes the viewBox in modules, quiet zone included', () => {
    const svg = toSvg('HELLO', { margin: 4 })
    expect(modules(svg)).toBe(toMatrix('HELLO').length + 8)
  })

  it('defaults to the four-module quiet zone the specification asks for', () => {
    expect(modules(toSvg('HELLO'))).toBe(toMatrix('HELLO').length + 8)
  })

  it('honours an explicit pixel size', () => {
    expect(toSvg('HELLO', { size: 360 })).toContain('width="360" height="360"')
  })

  it('scales by module when no size is given', () => {
    const svg = toSvg('HELLO', { scale: 8 })
    expect(svg).toContain(`width="${modules(svg) * 8}"`)
  })

  it('draws the dark modules as one path rather than a rect each', () => {
    const svg = toSvg('https://example.com/a-reasonably-long-url-to-encode')
    expect(svg.match(/<path/g)!.length).toBe(1)
    // A rect-per-module renderer emits hundreds of elements for the same code.
    expect(svg.match(/<rect/g)!.length).toBe(1)
  })

  it('omits the backdrop when the background is cleared', () => {
    expect(toSvg('HELLO', { background: null })).not.toContain('<rect')
    expect(toSvg('HELLO', { background: 'transparent' })).not.toContain('<rect')
  })

  /**
   * A code with no accessible name is decoration next to content that already
   * says the same thing; one with a name is an image. Neither should be an
   * unlabelled graphic that a screen reader announces as "image".
   */
  it('is hidden from assistive technology unless it is given a name', () => {
    expect(toSvg('HELLO')).toContain('aria-hidden="true"')
    const named = toSvg('HELLO', { title: 'Membership card' })
    expect(named).toContain('aria-label="Membership card"')
    expect(named).toContain('<title>Membership card</title>')
    expect(named).not.toContain('aria-hidden')
  })

  it('escapes markup in the colours and the title', () => {
    const svg = toSvg('HELLO', { title: '<script>&"', color: '"/><script>' })
    expect(svg).not.toContain('<script>')
    expect(svg).toContain('&lt;script&gt;')
  })

  it('encodes the same modules it renders', () => {
    // The path is built from the matrix, so a code whose matrix grows must
    // produce a viewBox that grows with it.
    expect(modules(toSvg('x'.repeat(200)))).toBeGreaterThan(modules(toSvg('x')))
  })
})

import { describe, expect, it } from 'bun:test'
import { QRErrorCorrectLevel, toMatrix, toTerminal } from '../packages/ts-qr-codes/src'

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

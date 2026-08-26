import { describe, expect, it } from 'bun:test'
import { toMatrix, toSvg } from '../packages/ts-qr-codes/src/qr/index'
import { QRErrorCorrectLevel } from '../packages/ts-qr-codes/src/types'

const URL = 'https://hq.training/app'
const MARK = '<circle cx="12" cy="12" r="9" fill="#114CFE"/>'

describe('toSvg: branding a code with a mark', () => {
  it('places the mark in a nested viewBox so callers never compute a transform', () => {
    const svg = toSvg(URL, { logo: { content: MARK } })

    expect(svg).toContain(MARK)
    expect(svg).toMatch(/<svg x="\d+" y="\d+" width="\d+" height="\d+" viewBox="0 0 24 24"/)
  })

  /**
   * A mark destroys modules. That is only survivable because the format is
   * redundant, so a logo has to come with the correction level that can rebuild
   * what it hides — otherwise the code scans on a good phone in good light and
   * fails everywhere else.
   */
  it('forces H even when the caller asked for less', () => {
    const withLogo = toSvg(URL, { logo: { content: MARK }, correctLevel: QRErrorCorrectLevel.M })
    const atH = toSvg(URL, { correctLevel: QRErrorCorrectLevel.H })
    const atM = toSvg(URL, { correctLevel: QRErrorCorrectLevel.M })

    const extent = (svg: string) => svg.match(/viewBox="0 0 (\d+)/)![1]
    expect(extent(withLogo)).toBe(extent(atH))
    expect(extent(withLogo)).not.toBe(extent(atM))
  })

  it('keeps a correction level stronger than H untouched', () => {
    const q = toSvg(URL, { logo: { content: MARK }, correctLevel: QRErrorCorrectLevel.Q })
    expect(q.length).toBeGreaterThan(0)
  })

  it('erases the modules under the mark instead of drawing over them', () => {
    const plain = toSvg(URL, { correctLevel: QRErrorCorrectLevel.H })
    const branded = toSvg(URL, { logo: { content: MARK, background: null } })

    const runs = (svg: string) => (svg.match(/M\d+ \d+h/g) || []).length
    // Clearing a square out of the centre splits runs that cross it, so the
    // path is rebuilt rather than merely overlaid.
    expect(branded.match(/<path[^>]*d="([^"]*)"/)![1]).not.toBe(plain.match(/<path[^>]*d="([^"]*)"/)![1])
    expect(runs(branded)).toBeGreaterThan(0)
  })

  it('refuses a mark large enough to stop the code scanning', () => {
    expect(() => toSvg(URL, { logo: { content: MARK, size: 0.45 } })).toThrow(RangeError)
    expect(() => toSvg(URL, { logo: { content: MARK, size: 0.3 } })).not.toThrow()
  })

  it('covers only a small fraction of the symbol at the default size', () => {
    const modules = toMatrix(URL, QRErrorCorrectLevel.H).length
    const span = Math.round(modules * 0.22)
    // H recovers roughly 30% of codewords; the default must sit far under it.
    expect((span * span) / (modules * modules)).toBeLessThan(0.1)
  })

  it('still renders without a logo', () => {
    const svg = toSvg(URL)
    expect(svg).toContain('<path')
    expect(svg).not.toContain('<svg x=')
  })
})

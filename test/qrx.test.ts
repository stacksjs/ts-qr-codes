import { describe, expect, it } from 'bun:test'
import { QRErrorCorrectLevel } from '../packages/qrx/src'

describe('qrx', () => {
  it('should export QRErrorCorrectLevel', () => {
    expect(QRErrorCorrectLevel).toBeDefined()
    expect(QRErrorCorrectLevel.L).toBe(1)
    expect(QRErrorCorrectLevel.M).toBe(0)
    expect(QRErrorCorrectLevel.Q).toBe(3)
    expect(QRErrorCorrectLevel.H).toBe(2)
  })
})

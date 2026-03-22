import type { QRCodeOptions, RSBlock } from '../types'
import { QRErrorCorrectLevel, QRMaskPattern, QRMode } from '../types'
import { getAndroid, getUTF8Length, isSupportCanvas } from './utils'

export * from './utils'

/**
 * A TypeScript library for working with QR codes.
 *
 * - Includes multiple drawing methods (Canvas, SVG, and Table).
 * - The word "QR Code" is a registered trademark of DENSO WAVE INCORPORATED
 *   http://www.denso-wave.com/qrcode/faqpatent-e.html
 *
 * Original author (JavaScript): Kazuhiko Arase
 * TypeScript conversion & documentation by: Chris Breuer
 *
 * References:
 * - https://github.com/stacksjs/qrx
 */

/**
 * A utility class for typical QR math functions, used by polynomial operations.
 */
class QRMath {
  public static EXP_TABLE: number[] = Array.from({ length: 256 })
  public static LOG_TABLE: number[] = Array.from({ length: 256 })

  public static glog(n: number): number {
    if (n < 1) {
      throw new Error(`glog(${n})`)
    }

    return QRMath.LOG_TABLE[n]
  }

  public static gexp(n: number): number {
    while (n < 0) {
      n += 255
    }

    while (n >= 256) {
      n -= 255
    }

    return QRMath.EXP_TABLE[n]
  }
}

// Pre-fill EXP_TABLE and LOG_TABLE
(() => {
  // Initialize EXP_TABLE
  for (let i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i
  }
  for (let i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i]
      = QRMath.EXP_TABLE[i - 4]
        ^ QRMath.EXP_TABLE[i - 5]
        ^ QRMath.EXP_TABLE[i - 6]
        ^ QRMath.EXP_TABLE[i - 8]
  }
  // Initialize LOG_TABLE
  for (let i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i
  }
})()

/**
 * QRPolynomial is used for calculating error correction codewords via polynomial arithmetic.
 */
class QRPolynomial {
  private num: number[]

  constructor(num: number[], shift: number) {
    if (!Array.isArray(num)) {
      throw new TypeError(`QRPolynomial constructor error: expected array, got ${typeof num}`)
    }

    let offset = 0
    while (offset < num.length && num[offset] === 0) {
      offset++
    }

    // Create the properly typed array
    // eslint-disable-next-line unicorn/no-new-array
    this.num = new Array<number>(num.length - offset + shift).fill(0)
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset]
    }
  }

  public get(index: number): number {
    return this.num[index]
  }

  public getLength(): number {
    return this.num.length
  }

  public multiply(e: QRPolynomial): QRPolynomial {
    // Explicitly type the array as number[]
    const num: number[] = Array.from(
      { length: this.getLength() + e.getLength() - 1 },
      () => 0,
    )

    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)))
      }
    }

    return new QRPolynomial(num, 0)
  }

  public mod(e: QRPolynomial): QRPolynomial {
    if (this.getLength() - e.getLength() < 0) {
      return this
    }

    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0))
    const num: number[] = Array.from(this.num) // Create typed copy

    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio)
    }

    // Now num is explicitly typed as number[]
    return new QRPolynomial(num, 0).mod(e)
  }
}

/**
 * QR8bitByte stores the data to be encoded in 8-bit byte mode (including UTF-8 support).
 */
class QR8bitByte {
  public mode: QRMode = QRMode.MODE_8BIT_BYTE
  public data: string
  public parsedData: number[] = []

  constructor(data: string) {
    this.data = data

    // Convert all codepoints to UTF-8
    for (let i = 0, l = data.length; i < l; i++) {
      const code = data.charCodeAt(i)
      const byteArray: number[] = []

      if (code > 0x10000) {
        byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18)
        byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12)
        byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6)
        byteArray[3] = 0x80 | (code & 0x3F)
      }
      else if (code > 0x800) {
        byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12)
        byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6)
        byteArray[2] = 0x80 | (code & 0x3F)
      }
      else if (code > 0x80) {
        byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6)
        byteArray[1] = 0x80 | (code & 0x3F)
      }
      else {
        byteArray[0] = code
      }

      this.parsedData.push(...byteArray)
    }

    // For some UTF-8 strings, add BOM (EF BB BF) if the length differs
    if (this.parsedData.length !== this.data.length) {
      this.parsedData.unshift(191, 187, 239)
    }
  }

  public getLength(): number {
    return this.parsedData.length
  }

  public write(buffer: QRBitBuffer): void {
    for (let i = 0, l = this.parsedData.length; i < l; i++) {
      buffer.put(this.parsedData[i], 8)
    }
  }
}

/**
 * Bit buffer used to store data before final encoding.
 */
class QRBitBuffer {
  public buffer: number[] = []
  public length: number = 0

  public get(index: number): boolean {
    const bufIndex = Math.floor(index / 8)
    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
  }

  public put(num: number, length: number): void {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  }

  public getLengthInBits(): number {
    return this.length
  }

  public putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0)
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8)
    }
    this.length++
  }
}

/**
 * RS block info table used for error correction calculations.
 * Each row corresponds to a combination of (typeNumber, errorCorrectionLevel).
 */
class QRRSBlock implements RSBlock {
  public totalCount: number
  public dataCount: number
  public errorCount: number

  constructor(totalCount: number, dataCount: number) {
    this.totalCount = totalCount
    this.dataCount = dataCount
    this.errorCount = totalCount - dataCount
  }

  private static RS_BLOCK_TABLE: number[][] = [
    // L  M  Q  H
    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12],
    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16],
  ]

  public static getRSBlocks(
    typeNumber: number,
    errorCorrectLevel: QRErrorCorrectLevel,
  ): QRRSBlock[] {
    const rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel)

    if (!rsBlock) {
      throw new Error(
        `Invalid RS Block configuration: typeNumber=${typeNumber}, errorCorrectLevel=${errorCorrectLevel}`,
      )
    }

    const length = rsBlock.length / 3
    const list: QRRSBlock[] = []

    try {
      for (let i = 0; i < length; i++) {
        const count = rsBlock[i * 3 + 0]
        const totalCount = rsBlock[i * 3 + 1]
        const dataCount = rsBlock[i * 3 + 2]

        // Validate block parameters
        if (totalCount < dataCount) {
          throw new Error(`Invalid RS Block parameters: totalCount=${totalCount}, dataCount=${dataCount}`)
        }

        for (let j = 0; j < count; j++) {
          const block = new QRRSBlock(totalCount, dataCount)
          if (!block.isValid()) {
            throw new Error(`Invalid RS Block created: totalCount=${totalCount}, dataCount=${dataCount}`)
          }
          list.push(block)
        }
      }

      return list
    }
    catch (error: any) {
      throw new Error(`Failed to create RS Blocks: ${error.message}`)
    }
  }

  // Add method to get error correction capacity percentage
  public getErrorCorrectionRate(): number {
    return (this.errorCount / this.totalCount) * 100
  }

  // Add method to validate block structure
  public isValid(): boolean {
    return this.totalCount > 0
      && this.dataCount > 0
      && this.errorCount >= 0
      && this.dataCount <= this.totalCount
  }

  private static getRsBlockTable(
    typeNumber: number,
    errorCorrectLevel: QRErrorCorrectLevel,
  ): number[] | undefined {
    const index = (typeNumber - 1) * 4
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[index + 0]
      case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[index + 1]
      case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[index + 2]
      case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[index + 3]
      default:
        return undefined
    }
  }
}

/**
 * Utility class for common QR operations (like BCH, polynomials, lost point calculation, etc).
 */
class QRUtil {
  public static PATTERN_POSITION_TABLE: number[][] = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170],
  ]

  public static G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0)
  public static G18
    = (1 << 12)
      | (1 << 11)
      | (1 << 10)
      | (1 << 9)
      | (1 << 8)
      | (1 << 5)
      | (1 << 2)
      | (1 << 0)

  public static G15_MASK
    = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)

  public static getBCHTypeInfo(data: number): number {
    let d = data << 10
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
      d ^= QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15))
    }
    return ((data << 10) | d) ^ QRUtil.G15_MASK
  }

  public static getBCHTypeNumber(data: number): number {
    let d = data << 12
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
      d ^= QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18))
    }
    return (data << 12) | d
  }

  public static getBCHDigit(data: number): number {
    let digit = 0
    while (data !== 0) {
      digit++
      data >>>= 1
    }
    return digit
  }

  public static getPatternPosition(typeNumber: number): number[] {
    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]
  }

  public static getMask(
    maskPattern: QRMaskPattern,
    i: number,
    j: number,
  ): boolean {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 === 0
      case QRMaskPattern.PATTERN001:
        return i % 2 === 0
      case QRMaskPattern.PATTERN010:
        return j % 3 === 0
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 === 0
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
      case QRMaskPattern.PATTERN101:
        return ((i * j) % 2) + ((i * j) % 3) === 0
      case QRMaskPattern.PATTERN110:
        return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0
      case QRMaskPattern.PATTERN111:
        return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0
      default:
        throw new Error(`bad maskPattern: ${maskPattern}`)
    }
  }

  public static getErrorCorrectPolynomial(errorCorrectLength: number): QRPolynomial {
    let a = new QRPolynomial([1], 0)
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0))
    }
    return a
  }

  public static getLengthInBits(mode: QRMode, type: number): number {
    if (type >= 1 && type < 10) {
      // 1 ~ 9
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10
        case QRMode.MODE_ALPHA_NUM:
          return 9
        case QRMode.MODE_8BIT_BYTE:
          return 8
        case QRMode.MODE_KANJI:
          return 8
        default:
          throw new Error(`mode: ${mode}`)
      }
    }
    else if (type < 27) {
      // 10 ~ 26
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12
        case QRMode.MODE_ALPHA_NUM:
          return 11
        case QRMode.MODE_8BIT_BYTE:
          return 16
        case QRMode.MODE_KANJI:
          return 10
        default:
          throw new Error(`mode: ${mode}`)
      }
    }
    else if (type < 41) {
      // 27 ~ 40
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14
        case QRMode.MODE_ALPHA_NUM:
          return 13
        case QRMode.MODE_8BIT_BYTE:
          return 16
        case QRMode.MODE_KANJI:
          return 12
        default:
          throw new Error(`mode: ${mode}`)
      }
    }
    else {
      throw new Error(`type: ${type}`)
    }
  }

  /**
   * Calculate the penalty ("lost point") from the current QR code modules.
   */
  public static getLostPoint(qrCode: QRCodeModel): number {
    const moduleCount = qrCode.getModuleCount()
    let lostPoint = 0

    // Level 1: adjacent modules in row/column in the same color
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0
        const dark = qrCode.isDark(row, col)

        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue
          }
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue
            }
            if (r === 0 && c === 0) {
              continue
            }
            if (dark === qrCode.isDark(row + r, col + c)) {
              sameCount++
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5
        }
      }
    }

    // Level 2: blocks of modules in same color
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0
        if (qrCode.isDark(row, col))
          count++
        if (qrCode.isDark(row + 1, col))
          count++
        if (qrCode.isDark(row, col + 1))
          count++
        if (qrCode.isDark(row + 1, col + 1))
          count++
        if (count === 0 || count === 4) {
          lostPoint += 3
        }
      }
    }

    // Level 3: pattern finder-like (1:1:3:1:1 ratio)
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (
          qrCode.isDark(row, col)
          && !qrCode.isDark(row, col + 1)
          && qrCode.isDark(row, col + 2)
          && qrCode.isDark(row, col + 3)
          && qrCode.isDark(row, col + 4)
          && !qrCode.isDark(row, col + 5)
          && qrCode.isDark(row, col + 6)
        ) {
          lostPoint += 40
        }
      }
    }

    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (
          qrCode.isDark(row, col)
          && !qrCode.isDark(row + 1, col)
          && qrCode.isDark(row + 2, col)
          && qrCode.isDark(row + 3, col)
          && qrCode.isDark(row + 4, col)
          && !qrCode.isDark(row + 5, col)
          && qrCode.isDark(row + 6, col)
        ) {
          lostPoint += 40
        }
      }
    }

    // Level 4: balance of dark and light modules
    let darkCount = 0
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col)) {
          darkCount++
        }
      }
    }
    const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5
    lostPoint += ratio * 10

    return lostPoint
  }
}

/**
 * QRCodeModel is the internal data structure that holds the modules, version, etc.
 */
class QRCodeModel {
  public typeNumber: number
  public errorCorrectLevel: QRErrorCorrectLevel
  public modules: (boolean | null)[][] | null = null
  public moduleCount: number = 0
  public dataCache: number[] | null = null
  public dataList: QR8bitByte[] = []

  public static PAD0 = 0xEC
  public static PAD1 = 0x11

  constructor(typeNumber: number, errorCorrectLevel: QRErrorCorrectLevel) {
    this.typeNumber = typeNumber
    this.errorCorrectLevel = errorCorrectLevel
  }

  public addData(data: string): void {
    const newData = new QR8bitByte(data)
    this.dataList.push(newData)
    this.dataCache = null
  }

  public isDark(row: number, col: number): boolean {
    if (
      row < 0
      || this.moduleCount <= row
      || col < 0
      || this.moduleCount <= col
    ) {
      throw new Error(`isDark(${row},${col}) out of bounds.`)
    }
    return this.modules![row][col] as boolean
  }

  public getModuleCount(): number {
    return this.moduleCount
  }

  public make(): void {
    this.makeImpl(false, this.getBestMaskPattern())
  }

  private makeImpl(test: boolean, maskPattern: number): void {
    this.moduleCount = this.typeNumber * 4 + 17
    this.modules = Array.from({ length: this.moduleCount }, () =>
      // eslint-disable-next-line unicorn/no-new-array
      new Array<boolean | null>(this.moduleCount).fill(null))

    this.setupPositionProbePattern(0, 0)
    this.setupPositionProbePattern(this.moduleCount - 7, 0)
    this.setupPositionProbePattern(0, this.moduleCount - 7)
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)

    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test)
    }

    if (this.dataCache === null) {
      // Get RS blocks for error correction
      const rsBlocks = QRRSBlock.getRSBlocks(this.typeNumber, this.errorCorrectLevel)

      // Calculate total data count from RS blocks
      const totalDataCount = rsBlocks.reduce((sum, block) => sum + block.dataCount, 0)

      // Validate data capacity
      const buffer = new QRBitBuffer()
      this.dataList.forEach((data) => {
        buffer.put(data.mode, 4)
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, this.typeNumber))
        data.write(buffer)
      })

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error(`Data overflow: ${buffer.getLengthInBits()} > ${totalDataCount * 8}`)
      }

      this.dataCache = QRCodeModel.createData(
        this.typeNumber,
        this.errorCorrectLevel,
        this.dataList,
      )
    }

    this.mapData(this.dataCache, maskPattern)
  }

  public getRSBlocks(): RSBlock[] {
    return QRRSBlock.getRSBlocks(this.typeNumber, this.errorCorrectLevel)
  }

  public getErrorCorrectionCapacity(): number {
    const rsBlocks = this.getRSBlocks()
    let totalECCodewords = 0

    rsBlocks.forEach((block) => {
      totalECCodewords += block.totalCount - block.dataCount
    })

    return totalECCodewords
  }

  private setupPositionProbePattern(row: number, col: number): void {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r)
        continue
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c)
          continue
        if (
          (r >= 0 && r <= 6 && (c === 0 || c === 6))
          || (c >= 0 && c <= 6 && (r === 0 || r === 6))
          || (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          if (this.modules) {
            this.modules[row + r][col + c] = true
          }
          else {
            throw new Error('Modules array is null')
          }
        }
        else {
          if (this.modules) {
            this.modules[row + r][col + c] = true
          }
          else {
            throw new Error('Modules array is null')
          }
        }
      }
    }
  }

  private getBestMaskPattern(): number {
    let minLostPoint = 0
    let pattern = 0

    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i)
      const lostPoint = QRUtil.getLostPoint(this)
      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }
    return pattern
  }

  private setupTimingPattern(): void {
    // vertical line
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules![r][6] !== null) {
        continue
      }
      this.modules![r][6] = r % 2 === 0
    }
    // horizontal line
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules![6][c] !== null) {
        continue
      }
      this.modules![6][c] = c % 2 === 0
    }
  }

  private setupPositionAdjustPattern(): void {
    const pos = QRUtil.getPatternPosition(this.typeNumber)
    if (!pos) {
      return
    }
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i]
        const col = pos[j]
        if (this.modules![row][col] !== null) {
          continue
        }
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (
              r === -2
              || r === 2
              || c === -2
              || c === 2
              || (r === 0 && c === 0)
            ) {
              this.modules![row + r][col + c] = true
            }
            else {
              this.modules![row + r][col + c] = false
            }
          }
        }
      }
    }
  }

  private setupTypeNumber(test: boolean): void {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber)
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this.modules![Math.floor(i / 3)][
        (i % 3) + this.moduleCount - 8 - 3
      ] = mod
    }
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this.modules![(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)]
        = mod
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number): void {
    const data = (this.errorCorrectLevel << 3) | maskPattern
    const bits = QRUtil.getBCHTypeInfo(data)

    // vertical
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 6) {
        this.modules![i][8] = mod
      }
      else if (i < 8) {
        this.modules![i + 1][8] = mod
      }
      else {
        this.modules![this.moduleCount - 15 + i][8] = mod
      }
    }

    // horizontal
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 8) {
        this.modules![8][this.moduleCount - i - 1] = mod
      }
      else if (i < 9) {
        this.modules![8][15 - i - 1 + 1] = mod
      }
      else {
        this.modules![8][15 - i - 1] = mod
      }
    }

    // fixed
    this.modules![this.moduleCount - 8][8] = !test
  }

  private mapData(data: number[], maskPattern: number): void {
    let inc = -1
    let row = this.moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6)
        col--
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules![row][col - c] === null) {
            let dark = false
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
            }
            const mask = QRUtil.getMask(maskPattern, row, col - c)
            if (mask) {
              dark = !dark
            }
            this.modules![row][col - c] = dark
            bitIndex--
            if (bitIndex === -1) {
              byteIndex++
              bitIndex = 7
            }
          }
        }
        row += inc
        if (row < 0 || this.moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  }

  public static createData(
    typeNumber: number,
    errorCorrectLevel: QRErrorCorrectLevel,
    dataList: QR8bitByte[],
  ): number[] {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel)
    const buffer = new QRBitBuffer()

    for (let i = 0; i < dataList.length; i++) {
      const data = dataList[i]
      buffer.put(data.mode, 4)
      buffer.put(
        data.getLength(),
        QRUtil.getLengthInBits(data.mode, typeNumber),
      )
      data.write(buffer)
    }

    // calc totalDataCount
    let totalDataCount = 0
    for (let i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error(
        `code length overflow. (${buffer.getLengthInBits()} > ${totalDataCount * 8})`,
      )
    }

    // end code
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4)
    }

    // padding
    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false)
    }

    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break
      }
      buffer.put(QRCodeModel.PAD0, 8)

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break
      }
      buffer.put(QRCodeModel.PAD1, 8)
    }

    return QRCodeModel.createBytes(buffer, rsBlocks)
  }

  public static createBytes(buffer: QRBitBuffer, rsBlocks: QRRSBlock[]): number[] {
    let offset = 0

    let maxDcCount = 0
    let maxEcCount = 0

    const dcData: number[][] = Array.from({ length: rsBlocks.length })
    const ecData: number[][] = Array.from({ length: rsBlocks.length })

    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount
      const ecCount = rsBlocks[r].totalCount - dcCount

      maxDcCount = Math.max(maxDcCount, dcCount)
      maxEcCount = Math.max(maxEcCount, ecCount)

      // eslint-disable-next-line unicorn/no-new-array
      dcData[r] = new Array(dcCount)
      for (let i = 0; i < dcCount; i++) {
        dcData[r][i] = 0xFF & buffer.buffer[i + offset]
      }
      offset += dcCount

      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount)
      const rawPoly = new QRPolynomial(dcData[r], rsPoly.getLength() - 1)
      const modPoly = rawPoly.mod(rsPoly)

      ecData[r] = Array.from({ length: rsPoly.getLength() - 1 })
      for (let i = 0; i < ecData[r].length; i++) {
        const modIndex = i + modPoly.getLength() - ecData[r].length
        ecData[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
      }
    }

    let totalCodeCount = 0
    for (let i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].totalCount
    }

    // eslint-disable-next-line unicorn/no-new-array
    const data = new Array(totalCodeCount)
    let index = 0

    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcData[r].length) {
          data[index++] = dcData[r][i]
        }
      }
    }

    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecData[r].length) {
          data[index++] = ecData[r][i]
        }
      }
    }
    return data
  }
}

/**
 * Pre-calculated length limitations for each version (1-40) at each error level.
 */
const QRCodeLimitLength: number[][] = [
  [17, 14, 11, 7],
  [32, 26, 20, 14],
  [53, 42, 32, 24],
  [78, 62, 46, 34],
  [106, 84, 60, 44],
  // ... truncated for brevity ...
]

/**
 * Gets the minimal QR version that can hold a given string for the specified Error Correct Level.
 */
function getTypeNumber(sText: string, nCorrectLevel: QRErrorCorrectLevel): number {
  let nType = 1
  const length = getUTF8Length(sText)

  for (let i = 0, len = QRCodeLimitLength.length; i < len; i++) {
    let nLimit = 0
    switch (nCorrectLevel) {
      case QRErrorCorrectLevel.L:
        nLimit = QRCodeLimitLength[i][0]
        break
      case QRErrorCorrectLevel.M:
        nLimit = QRCodeLimitLength[i][1]
        break
      case QRErrorCorrectLevel.Q:
        nLimit = QRCodeLimitLength[i][2]
        break
      case QRErrorCorrectLevel.H:
        nLimit = QRCodeLimitLength[i][3]
        break
    }

    if (length <= nLimit) {
      break
    }
    else {
      nType++
    }

    if (nType > QRCodeLimitLength.length) {
      throw new Error('Too long data')
    }
  }
  return nType
}

/**
 * Drawing interface: each method of drawing (Canvas, SVG, Table) implements `draw` and `clear`.
 */
interface IDrawing {
  draw: (qrCode: QRCodeModel) => void
  clear: () => void
}

/**
 * SVG drawing implementation.
 */
class SvgDrawer implements IDrawing {
  private el: HTMLElement
  private colorDark: string
  private colorLight: string
  private width: number
  private height: number

  constructor(el: HTMLElement, options: QRCodeOptions) {
    this.el = el
    this.colorDark = options.colorDark ?? '#000000'
    this.colorLight = options.colorLight ?? '#ffffff'
    this.width = options.width ?? 256
    this.height = options.height ?? 256
  }

  public draw(qrCode: QRCodeModel): void {
    const nCount = qrCode.getModuleCount()

    // Clear existing
    this.clear()

    // Create root SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', `0 0 ${nCount} ${nCount}`)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('fill', this.colorLight)

    // Append an overall background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bgRect.setAttribute('fill', this.colorLight)
    bgRect.setAttribute('width', '100%')
    bgRect.setAttribute('height', '100%')
    svg.appendChild(bgRect)

    // "template" rect that will be cloned
    const darkRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    darkRect.setAttribute('fill', this.colorDark)
    darkRect.setAttribute('width', '1')
    darkRect.setAttribute('height', '1')
    darkRect.setAttribute('id', 'template')
    svg.appendChild(darkRect)

    // Fill out each dark cell
    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        if (qrCode.isDark(row, col)) {
          const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use')
          useEl.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'href',
            '#template',
          )
          useEl.setAttribute('x', String(col))
          useEl.setAttribute('y', String(row))
          svg.appendChild(useEl)
        }
      }
    }

    this.el.appendChild(svg)
  }

  public clear(): void {
    while (this.el.hasChildNodes()) {
      this.el.removeChild(this.el.lastChild!)
    }
  }
}

/**
 * TableDrawer (DOM table) fallback for old browsers with no Canvas/SVG support.
 */
class TableDrawer implements IDrawing {
  private el: HTMLElement
  private colorDark: string
  private colorLight: string
  private width: number
  private height: number

  constructor(el: HTMLElement, options: QRCodeOptions) {
    this.el = el
    this.colorDark = options.colorDark ?? '#000000'
    this.colorLight = options.colorLight ?? '#ffffff'
    this.width = options.width ?? 256
    this.height = options.height ?? 256
  }

  public draw(qrCode: QRCodeModel): void {
    const nCount = qrCode.getModuleCount()
    const nWidth = Math.floor(this.width / nCount)
    const nHeight = Math.floor(this.height / nCount)

    this.clear()

    const aHTML: string[] = ['<table style="border:0;border-collapse:collapse;">']

    for (let row = 0; row < nCount; row++) {
      aHTML.push('<tr>')
      for (let col = 0; col < nCount; col++) {
        const color = qrCode.isDark(row, col)
          ? this.colorDark
          : this.colorLight
        aHTML.push(
          `<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:${nWidth}px;height:${nHeight}px;background-color:${color};"></td>`,
        )
      }
      aHTML.push('</tr>')
    }
    aHTML.push('</table>')

    this.el.innerHTML = aHTML.join('')

    // Center the table if there's extra margin
    const elTable = this.el.childNodes[0] as HTMLElement
    const leftMargin = (this.width - elTable.offsetWidth) / 2
    const topMargin = (this.height - elTable.offsetHeight) / 2
    if (leftMargin > 0 && topMargin > 0) {
      (elTable.style as any).margin = `${topMargin}px ${leftMargin}px`
    }
  }

  public clear(): void {
    this.el.innerHTML = ''
  }
}

/**
 * CanvasDrawer uses the HTMLCanvasElement to draw the QR code.
 */
class CanvasDrawer implements IDrawing {
  private el: HTMLElement
  private colorDark: string
  private colorLight: string
  private width: number
  private height: number
  private android: number | boolean
  private isPainted: boolean = false
  private elCanvas: HTMLCanvasElement
  private elImage: HTMLImageElement
  private bSupportDataURI: boolean | null = null

  constructor(el: HTMLElement, options: QRCodeOptions) {
    this.el = el
    this.colorDark = options.colorDark ?? '#000000'
    this.colorLight = options.colorLight ?? '#ffffff'
    this.width = options.width ?? 256
    this.height = options.height ?? 256

    this.android = getAndroid()

    this.elCanvas = document.createElement('canvas')
    this.elCanvas.width = this.width
    this.elCanvas.height = this.height
    this.el.appendChild(this.elCanvas)

    this.elImage = document.createElement('img')
    this.elImage.alt = 'Scan me!'
    this.elImage.style.display = 'none'
    this.el.appendChild(this.elImage)

    this.isPainted = false
  }

  public draw(qrCode: QRCodeModel): void {
    const context = this.elCanvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2D context from canvas.')
    }

    const nCount = qrCode.getModuleCount()
    const nWidth = this.width / nCount
    const nHeight = this.height / nCount
    const nRoundedWidth = Math.round(nWidth)
    const nRoundedHeight = Math.round(nHeight)

    this.elImage.style.display = 'none'
    this.clear()

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        const bIsDark = qrCode.isDark(row, col)
        const nLeft = col * nWidth
        const nTop = row * nHeight

        context.strokeStyle = bIsDark ? this.colorDark : this.colorLight
        context.lineWidth = 1
        context.fillStyle = bIsDark ? this.colorDark : this.colorLight
        context.fillRect(nLeft, nTop, nWidth, nHeight)

        // Prevent anti-aliasing lines
        context.strokeRect(
          Math.floor(nLeft) + 0.5,
          Math.floor(nTop) + 0.5,
          nRoundedWidth,
          nRoundedHeight,
        )
        context.strokeRect(
          Math.ceil(nLeft) - 0.5,
          Math.ceil(nTop) - 0.5,
          nRoundedWidth,
          nRoundedHeight,
        )
      }
    }

    this.isPainted = true
  }

  public clear(): void {
    const context = this.elCanvas.getContext('2d')
    if (!context)
      return
    context.clearRect(0, 0, this.elCanvas.width, this.elCanvas.height)
    this.isPainted = false
  }

  public makeImage(): void {
    if (this.isPainted) {
      this.safeSetDataURI(() => this.onMakeImage())
    }
  }

  private onMakeImage(): void {
    this.elImage.src = this.elCanvas.toDataURL('image/png')
    this.elImage.style.display = 'block'
    this.elCanvas.style.display = 'none'
  }

  /**
   * Check if DataURI is supported; if yes, run success, else fail.
   */
  private safeSetDataURI(fSuccess: () => void, fFail?: () => void): void {
    if (this.bSupportDataURI === null) {
      const el = document.createElement('img')
      el.onabort = () => {
        this.bSupportDataURI = false
        if (fFail)
          fFail()
      }
      el.onerror = () => {
        this.bSupportDataURI = false
        if (fFail)
          fFail()
      }
      el.onload = () => {
        this.bSupportDataURI = true
        fSuccess()
      }
      // A tiny image
      el.src
        = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    }
    else if (this.bSupportDataURI === true) {
      fSuccess()
    }
    else if (this.bSupportDataURI === false && fFail) {
      fFail()
    }
  }
}

/**
 * QRCode main class: the public API for generating and drawing QR codes.
 */
export class QRCode {
  private htOption: Required<QRCodeOptions>
  private android: number | boolean
  private el: HTMLElement
  private oQRCode: QRCodeModel | null = null
  private oDrawing: IDrawing

  /**
   * Creates a new QRCode instance.
   *
   * @param el A DOM element or element ID for drawing the QR code.
   * @param vOption Either a string (the text to encode) or an options object.
   */
  constructor(el: string | HTMLElement, vOption: string | QRCodeOptions) {
    // Default configuration
    this.htOption = {
      text: '',
      width: 256,
      height: 256,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRErrorCorrectLevel.H,
      useSVG: false,
    }

    if (typeof vOption === 'string') {
      this.htOption.text = vOption
    }
    else if (vOption) {
      // Merge user-provided options
      this.htOption = { ...this.htOption, ...vOption }
    }

    if (typeof el === 'string') {
      const foundEl = document.getElementById(el)
      if (!foundEl) {
        throw new Error(`Element with id=${el} not found.`)
      }
      this.el = foundEl
    }
    else {
      this.el = el
    }

    this.android = getAndroid()

    // Decide which drawing approach to use
    if (this.htOption.useSVG) {
      this.oDrawing = new SvgDrawer(this.el, this.htOption)
    }
    else if (!isSupportCanvas()) {
      this.oDrawing = new TableDrawer(this.el, this.htOption)
    }
    else {
      this.oDrawing = new CanvasDrawer(this.el, this.htOption)
    }

    if (this.htOption.text) {
      this.makeCode(this.htOption.text)
    }
  }

  /**
   * Generates the QR code data and draws it to the chosen renderer.
   */
  public makeCode(sText: string): void {
    // Determine the minimal type version that can fit the text
    const typeNumber = getTypeNumber(sText, this.htOption.correctLevel)
    this.oQRCode = new QRCodeModel(typeNumber, this.htOption.correctLevel)
    this.oQRCode.addData(sText)
    this.oQRCode.make();

    // Title as a tooltip
    (this.el as HTMLElement).title = sText

    this.oDrawing.draw(this.oQRCode)

    // If canvas, it can optionally render as an image afterwards
    if (typeof (this.oDrawing as CanvasDrawer).makeImage === 'function') {
      const cDrawer = this.oDrawing as CanvasDrawer
      if (!this.android || (typeof this.android === 'number' && this.android >= 3)) {
        cDrawer.makeImage()
      }
    }
  }

  /**
   * Clears the currently drawn QR code.
   */
  public clear(): void {
    this.oDrawing.clear()
  }
}

/**
 * Also expose the correct level enumeration for convenience.
 */
export const QRCodeCorrectLevel: typeof QRErrorCorrectLevel = QRErrorCorrectLevel

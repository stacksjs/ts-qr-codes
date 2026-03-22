// Encoding documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#Encoding
//
// UPC-E documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#UPC-E

import Barcode from '../Barcode'
import { encode } from './encoder'
import { checksum } from './UPC'

const EXPANSIONS = [
  'XX00000XXX',
  'XX10000XXX',
  'XX20000XXX',
  'XXX00000XX',
  'XXXX00000X',
  'XXXXX00005',
  'XXXXX00006',
  'XXXXX00007',
  'XXXXX00008',
  'XXXXX00009',
]

const PARITIES = [
  ['EEEOOO', 'OOOEEE'],
  ['EEOEOO', 'OOEOEE'],
  ['EEOOEO', 'OOEEOE'],
  ['EEOOOE', 'OOEEEO'],
  ['EOEEOO', 'OEOOEE'],
  ['EOOEEO', 'OEEOOE'],
  ['EOOOEE', 'OEEEOO'],
  ['EOEOEO', 'OEOEOE'],
  ['EOEOOE', 'OEOEEO'],
  ['EOOEOE', 'OEEOEO'],
]

export class UPCE extends Barcode {
  isValid: boolean
  middleDigits!: string
  upcA!: string
  // text: string
  displayValue!: boolean
  fontSize!: number
  guardHeight!: number

  constructor(data: string, options: any) {
    // Code may be 6 or 8 digits;
    // A 7 digit code is ambiguous as to whether the extra digit
    // is a UPC-A check or number system digit.
    super(data, options)
    this.isValid = false
    if (data.search(/^\d{6}$/) !== -1) {
      this.middleDigits = data
      // this.! = expandToUPCA(data, '0')
      // this.text = options.text
      // || `${this!.![0]}${data}${this.upcA[this.upcA.length - 1]}`
      // this.i!sValid = true
    }
    else if (data.search(/^[01]\d{7}$/) !== -1) {
      this.middleDigits = data.substring(1, data.length - 1)
      this.upcA = expandToUPCA(this.middleDigits, data[0])

      if (this.upcA[this.upcA.length - 1] === data[data.length - 1]) {
        this.isValid = true
      }
      else {
        // checksum mismatch
        return
      }
    }
    else {
      return
    }

    this.displayValue = options.displayValue

    // Make sure the font is not bigger than the space between the guard bars
    if (options.fontSize > options.width * 10) {
      this.fontSize = options.width * 10
    }
    else {
      this.fontSize = options.fontSize
    }

    // Make the guard bars go down half the way of the text
    this.guardHeight! = options.height + this.fontSize / 2 + options.textMargin
  }

  valid(): boolean {
    return this.isValid
  }

  encode(): { text: string, data: string } {
    if (this.options.flat) {
      return this.flatEncoding()
    }

    return this.guardedEncoding()
  }

  flatEncoding(): { text: string, data: string } {
    let result = ''

    result += '101'
    result += this.encodeMiddleDigits()
    result += '010101'

    return {
      data: result,
      text: this.text,
    }
  }

  guardedEncoding(): any {
    const result = []

    // Add the UPC-A number system digit beneath the quiet zone
    if (this.displayValue) {
      result.push({
        data: '00000000',
        text: this.text[0],
        options: { textAlign: 'left', fontSize: this.fontSize },
      })
    }

    // Add the guard bars
    result.push({
      data: '101',
      options: { height: this.guardHeight },
    })

    // Add the 6 UPC-E digits
    result.push({
      data: this.encodeMiddleDigits(),
      text: this.text.substring(1, 7),
      options: { fontSize: this.fontSize },
    })

    // Add the end bits
    result.push({
      data: '010101',
      options: { height: this.guardHeight },
    })

    // Add the UPC-A check digit beneath the quiet zone
    if (this.displayValue) {
      result.push({
        data: '00000000',
        text: this.text[7],
        options: { textAlign: 'right', fontSize: this.fontSize },
      })
    }

    return result
  }

  encodeMiddleDigits(): string {
    const numberSystem = this.upcA[0]
    const checkDigit = this.upcA[this.upcA.length - 1]
    const parity = PARITIES[Number.parseInt(checkDigit)][Number.parseInt(numberSystem)]
    return encode(this.middleDigits, parity)
  }
}

function expandToUPCA(middleDigits: string, numberSystem: string): string {
  const lastUpcE = Number.parseInt(middleDigits[middleDigits.length - 1])
  const expansion = EXPANSIONS[lastUpcE]

  let result = ''
  let digitIndex = 0
  for (let i = 0; i < expansion.length; i++) {
    const c = expansion[i]
    if (c === 'X') {
      result += middleDigits[digitIndex++]
    }
    else {
      result += c
    }
  }

  result = `${numberSystem}${result}`
  return `${result}${checksum(result)}`
}

export default UPCE

// Encoding documentation:
// https://en.wikipedia.org/wiki/EAN_5#Encoding

import Barcode from '../Barcode'
import { EAN5_STRUCTURE } from './constants'
import { encode } from './encoder'

function checksum(data: string) {
  const result = data
    .split('')
    .map(n => +n)
    .reduce((sum, a, idx) => {
      return idx % 2
        ? sum + a * 9
        : sum + a * 3
    }, 0)

  return result % 10
}

export class EAN5 extends Barcode {
  constructor(data: string, options: any) {
    super(data, options)
  }

  valid(): boolean {
    return this.data.search(/^\d{5}$/) !== -1
  }

  encode(): any {
    const structure = EAN5_STRUCTURE[checksum(this.data)]
    return {
      data: `1011${encode(this.data, structure, '01')}`,
      text: this.text,
    }
  }
}

export default EAN5

// Encoding documentation:
// http://www.barcodeisland.com/ean8.phtml

import { EAN } from './EAN'

// Calculate the checksum digit
function checksum(number: string): number {
  const res = number
    .substr(0, 7)
    .split('')
    .map(n => +n)
    .reduce((sum, a, idx) => (
      idx % 2 ? sum + a : sum + a * 3
    ), 0)

  return (10 - (res % 10)) % 10
}

export class EAN8 extends EAN {
  constructor(data: string, options: any) {
    // Add checksum if it does not exist
    if (data.search(/^\d{7}$/) !== -1) {
      data += checksum(data)
    }

    super(data, options)
  }

  valid(): boolean {
    return (
      this.data.search(/^\d{8}$/) !== -1
      && +this.data[7] === checksum(this.data)
    )
  }

  leftText(): string {
    return super.leftText(0, 4)
  }

  leftEncode(): string {
    const data = this.data.substr(0, 4)
    return super.leftEncode(data, 'LLLL')
  }

  rightText(): string {
    return super.rightText(4, 4)
  }

  rightEncode(): string {
    const data = this.data.substr(4, 4)
    return super.rightEncode(data, 'RRRR')
  }
}

export default EAN8

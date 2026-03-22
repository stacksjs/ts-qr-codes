// Encoding documentation
// http://www.gomaro.ch/ftproot/Laetus_PHARMA-CODE.pdf
import Barcode from '../Barcode'

export class Pharmacode extends Barcode {
  number: number

  constructor(data: string, options: any) {
    super(data, options)
    this.number = Number.parseInt(data, 10)
  }

  encode(): { text: string, data: string } {
    let z = this.number
    let result = ''

    // http://i.imgur.com/RMm4UDJ.png
    // (source: http://www.gomaro.ch/ftproot/Laetus_PHARMA-CODE.pdf, page: 34)
    while (!Number.isNaN(z) && z !== 0) {
      if (z % 2 === 0) { // Even
        result = `11100${result}`
        z = (z - 2) / 2
      }
      else { // Odd
        result = `100${result}`
        z = (z - 1) / 2
      }
    }

    // Remove the two last zeroes
    result = result.slice(0, -2)

    return {
      data: result,
      text: this.text,
    }
  }

  valid(): boolean {
    return this.number >= 3 && this.number <= 131070
  }
}

export default Pharmacode

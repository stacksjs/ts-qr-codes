import Barcode from '../Barcode'
import { BINARIES, END_BIN, START_BIN } from './constants'

class ITF extends Barcode {
  valid(): boolean {
    return this.data.search(/^(\d{2})+$/) !== -1
  }

  encode(): { text: string, data: string } {
    // Calculate all the digit pairs
    const encoded = this.data
      .match(/.{2}/g) || []
      .map(pair => this.encodePair(pair))
      .join('')

    return {
      data: START_BIN + encoded + END_BIN,
      text: this.text,
    }
  }

  // Calculate the data of a number pair
  encodePair(pair: string): string {
    const second = BINARIES[Number(pair[1])]

    return BINARIES[Number(pair[0])]
      .split('')
      .map((first, idx) => (
        (first === '1' ? '111' : '1')
        + (second[idx] === '1' ? '000' : '0')
      ))
      .join('')
  }
}

export default ITF

import Barcode from '../Barcode'
import { MIDDLE_BIN, SIDE_BIN } from './constants'
import { encode } from './encoder'

// Base class for EAN8 & EAN13
export class EAN extends Barcode {
  fontSize: number
  guardHeight: number

  constructor(data: string, options: any) {
    super(data, options)

    // Make sure the font is not bigger than the space between the guard bars
    this.fontSize = !options.flat && options.fontSize > options.width * 10
      ? options.width * 10
      : options.fontSize

    // Make the guard bars go down half the way of the text
    this.guardHeight = options.height + this.fontSize / 2 + options.textMargin
  }

  encode(): any {
    return this.options.flat
      ? this.encodeFlat()
      : this.encodeGuarded()
  }

  leftText(from?: number, to?: number): string {
    if (!from)
      from = 1 // TODO: test me

    if (!to)
      to = 6

    return this.text.substr(from, to)
  }

  leftEncode(data?: any, structure?: any): any {
    if (!data)
      data = this.data

    if (!structure)
      structure = this.options.structure

    return encode(data, structure)
  }

  rightText(from?: number, to?: number): string {
    if (!from)
      from = 1

    if (!to)
      to = this.data.length

    return this.text.substr(from, to)
  }

  rightEncode(data?: any, structure?: any): any {
    if (!data)
      data = this.data

    if (!structure)
      structure = this.options.structure

    return encode(data, structure)
  }

  encodeGuarded(): any {
    const textOptions = { fontSize: this.fontSize }
    const guardOptions = { height: this.guardHeight }

    return [
      { data: SIDE_BIN, options: guardOptions },
      { data: this.leftEncode(), text: this.leftText(), options: textOptions },
      { data: MIDDLE_BIN, options: guardOptions },
      { data: this.rightEncode(), text: this.rightText(), options: textOptions },
      { data: SIDE_BIN, options: guardOptions },
    ]
  }

  encodeFlat(): any {
    const data = [
      SIDE_BIN,
      this.leftEncode(),
      MIDDLE_BIN,
      this.rightEncode(),
      SIDE_BIN,
    ]

    return {
      data: data.join(''),
      text: this.text,
    }
  }
}

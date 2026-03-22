import Barcode from '../Barcode'

class GenericBarcode extends Barcode {
  constructor(data: string, options: any) {
    super(data, options) // Sets this.data and this.text
  }

  // Return the corresponding binary numbers for the data provided
  encode(): { data: string, text: string } {
    return {
      data: '10101010101010101010101010101010101010101',
      text: this.text,
    }
  }

  // Return true/false if the string provided is valid for this encoder
  valid(): boolean {
    return true
  }
}

export { GenericBarcode }

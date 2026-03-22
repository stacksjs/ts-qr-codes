export class Barcode {
  data: string
  text: string
  options: any

  constructor(data: string, options: any) {
    this.data = data
    this.text = options.text || data
    this.options = options
  }
}

export default Barcode

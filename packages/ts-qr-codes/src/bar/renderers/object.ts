export class ObjectRenderer {
  object: any
  encodings: any
  options: any

  constructor(object: any, encodings: any, options: any) {
    this.object = object
    this.encodings = encodings
    this.options = options
  }

  render(): void {
    this.object.encodings = this.encodings
  }
}

export default ObjectRenderer

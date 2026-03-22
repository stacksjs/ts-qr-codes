class InvalidInputException extends Error {
  symbology: string
  input: string

  constructor(symbology: string, input: string) {
    super()
    this.name = 'InvalidInputException'

    this.symbology = symbology
    this.input = input

    this.message = `"${this.input}" is not a valid input for ${this.symbology}`
  }
}

class InvalidElementException extends Error {
  constructor() {
    super()
    this.name = 'InvalidElementException'
    this.message = 'Not supported type to render on'
  }
}

class NoElementException extends Error {
  constructor() {
    super()
    this.name = 'NoElementException'
    this.message = 'No element to render on.'
  }
}

export { InvalidElementException, InvalidInputException, NoElementException }

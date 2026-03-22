import { defaults } from '../config'
import { barcodes } from './drivers/index'
import ErrorHandler from './exceptions/ErrorHandler'
import { InvalidInputException, NoElementException } from './exceptions/exceptions'
import { fixOptions } from './utils/fixOptions'
import { getRenderProperties } from './utils/getRenderProperties'
import { linearizeEncodings } from './utils/linearizeEncodings'
import { merge } from './utils/merge'
import optionsFromStrings from './utils/optionsFromStrings'

const API = function () { }

export const barcode = function (element: any, text: any, options: any): any {
  // @ts-expect-error - unsure right now of how we could handle this better
  const api = new API()

  if (typeof element === 'undefined') {
    throw new TypeError('No element to render on was provided.')
  }

  // Variables that will be passed through the API calls
  api._renderProperties = getRenderProperties(element)
  api._encodings = []
  api._options = defaults
  api._errorHandler = new ErrorHandler(api)

  // If text is set, use the simple syntax (render the barcode directly)
  if (typeof text !== 'undefined') {
    options = options || {}

    if (!options.format) {
      options.format = autoSelectBarcode()
    }

    api.options(options)[options.format](text, options).render()
  }

  return api
}

// Register all barcodes
for (const name in barcodes) {
  if (Object.prototype.hasOwnProperty.call(barcodes, name)) {
    registerBarcode(barcodes, name)
  }
}

function registerBarcode(barcodes: any, name: any): void {
  API.prototype[name]
    = API.prototype[name.toUpperCase()]
    = API.prototype[name.toLowerCase()]
    = function (text: any, options: any): any {
          return this._errorHandler.wrapBarcodeCall(() => {
            // Ensure text is options.text
            options.text = typeof options.text === 'undefined' ? undefined : `${options.text}`

            let newOptions = merge(this._options, options)
            newOptions = optionsFromStrings(newOptions)
            const Encoder = barcodes[name]
            const encoded = encode(text, Encoder, newOptions)
            this._encodings.push(encoded)

            return this
          })
        }
}

// encode() handles the Encoder call and builds the binary string to be rendered
function encode(text: any, Encoder: any, options: any): any {
  // Ensure that text is a string
  text = `${text}`

  const encoder = new Encoder(text, options)

  // If the input is not valid for the encoder, throw error.
  // If the valid callback option is set, call it instead of throwing error
  if (!encoder.valid()) {
    throw new InvalidInputException(encoder.constructor.name, text)
  }

  // Make a request for the binary data (and other information) that should be rendered
  let encoded = encoder.encode()

  // Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
  // Convert to [1-1, 1-2, 2, 3-1, 3-2]
  encoded = linearizeEncodings(encoded)

  // Merge
  for (let i = 0; i < encoded.length; i++) {
    encoded[i].options = merge(options, encoded[i].options)
  }

  return encoded
}

function autoSelectBarcode() {
  // default to type CODE128 if exists
  if (barcodes.CODE128) {
    return 'CODE128'
  }

  // Else, take the first (probably only) barcode
  return Object.keys(barcodes)[0]
}

// Sets global encoder options
// Added to the api by the barcode function
API.prototype.options = function (options: any) {
  this._options = merge(this._options, options)
  return this
}

// Will create a blank space (usually in between barcodes)
API.prototype.blank = function (size: any) {
  // eslint-disable-next-line unicorn/no-new-array
  const zeroes = new Array(size + 1).join('0')
  this._encodings.push({ data: zeroes })
  return this
}

// Initialize barcode on all HTML elements defined.
API.prototype.init = function () {
  // Should do nothing if no elements where found
  if (!this._renderProperties) {
    return
  }

  // Make sure renderProperties is an array
  if (!Array.isArray(this._renderProperties)) {
    this._renderProperties = [this._renderProperties]
  }

  let renderProperty: any
  let options: any
  for (const i in this._renderProperties) {
    renderProperty = this._renderProperties[i]
    options = merge(this._options, renderProperty.options)

    if (options.format === 'auto') {
      options.format = autoSelectBarcode()
    }

    this._errorHandler.wrapBarcodeCall(() => {
      const text = options.value
      const Encoder = barcodes[options.format.toUpperCase()]
      const encoded = encode(text, Encoder, options)

      render(renderProperty, encoded, options)
    })
  }
}

// The render API call. Calls the real render function.
API.prototype.render = function () {
  if (!this._renderProperties) {
    throw new NoElementException()
  }

  if (Array.isArray(this._renderProperties)) {
    for (let i = 0; i < this._renderProperties.length; i++) {
      render(this._renderProperties[i], this._encodings, this._options)
    }
  }
  else {
    render(this._renderProperties, this._encodings, this._options)
  }

  return this
}

API.prototype._defaults = defaults

// Prepares the encodings and calls the renderer
function render(renderProperties: any, encodings: any[], options: any) {
  encodings = linearizeEncodings(encodings)

  for (let i = 0; i < encodings.length; i++) {
    encodings[i].options = merge(options, encodings[i].options)
    fixOptions(encodings[i].options)
  }

  fixOptions(options)

  const Renderer = renderProperties.renderer
  const renderer = new Renderer(renderProperties.element, encodings, options)
  renderer.render()

  if (renderProperties.afterRender) {
    renderProperties.afterRender()
  }
}

// Export to browser
if (typeof window !== 'undefined') {
  window.barcode = barcode
}

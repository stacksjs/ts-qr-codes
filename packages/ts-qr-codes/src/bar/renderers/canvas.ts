import merge from '../utils/merge'
import { calculateEncodingAttributes, getMaximumHeightOfEncodings, getTotalWidthOfEncodings } from './shared'

export class CanvasRenderer {
  canvas: any
  encodings: any
  options: any

  constructor(canvas: any, encodings: any, options: any) {
    this.canvas = canvas
    this.encodings = encodings
    this.options = options
  }

  render(): void {
    // Abort if the browser does not support HTML5 canvas
    if (!this.canvas.getContext) {
      throw new Error('The browser does not support canvas.')
    }

    this.prepareCanvas()
    for (let i = 0; i < this.encodings.length; i++) {
      const encodingOptions = merge(this.options, this.encodings[i].options)

      this.drawCanvasBarcode(encodingOptions, this.encodings[i])
      this.drawCanvasText(encodingOptions, this.encodings[i])

      this.moveCanvasDrawing(this.encodings[i])
    }

    this.restoreCanvas()
  }

  prepareCanvas(): void {
    // Get the canvas context
    const ctx = this.canvas.getContext('2d')

    ctx.save()

    calculateEncodingAttributes(this.encodings, this.options, ctx)
    const totalWidth = getTotalWidthOfEncodings(this.encodings)
    const maxHeight = getMaximumHeightOfEncodings(this.encodings)

    this.canvas.width = totalWidth + this.options.marginLeft + this.options.marginRight

    this.canvas.height = maxHeight

    // Paint the canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (this.options.background) {
      ctx.fillStyle = this.options.background
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    ctx.translate(this.options.marginLeft, 0)
  }

  drawCanvasBarcode(options: any, encoding: any): void {
    // Get the canvas context
    const ctx = this.canvas.getContext('2d')

    const binary = encoding.data

    // Creates the barcode out of the encoded binary
    let yFrom
    if (options.textPosition === 'top') {
      yFrom = options.marginTop + options.fontSize + options.textMargin
    }
    else {
      yFrom = options.marginTop
    }

    ctx.fillStyle = options.lineColor

    for (let b = 0; b < binary.length; b++) {
      const x = b * options.width + encoding.barcodePadding

      if (binary[b] === '1') {
        ctx.fillRect(x, yFrom, options.width, options.height)
      }
      else if (binary[b]) {
        ctx.fillRect(x, yFrom, options.width, options.height * binary[b])
      }
    }
  }

  drawCanvasText(options: any, encoding: any): void {
    // Get the canvas context
    const ctx = this.canvas.getContext('2d')

    const font = `${options.fontOptions} ${options.fontSize}px ${options.font}`

    // Draw the text if displayValue is set
    if (options.displayValue) {
      let x, y

      if (options.textPosition === 'top') {
        y = options.marginTop + options.fontSize - options.textMargin
      }
      else {
        y = options.height + options.textMargin + options.marginTop + options.fontSize
      }

      ctx.font = font

      // Draw the text in the correct X depending on the textAlign option
      if (options.textAlign === 'left' || encoding.barcodePadding > 0) {
        x = 0
        ctx.textAlign = 'left'
      }
      else if (options.textAlign === 'right') {
        x = encoding.width - 1
        ctx.textAlign = 'right'
      }
      // In all other cases, center the text
      else {
        x = encoding.width / 2
        ctx.textAlign = 'center'
      }

      ctx.fillText(encoding.text, x, y)
    }
  }

  moveCanvasDrawing(encoding: any): void {
    const ctx = this.canvas.getContext('2d')

    ctx.translate(encoding.width, 0)
  }

  restoreCanvas(): void {
    // Get the canvas context
    const ctx = this.canvas.getContext('2d')

    ctx.restore()
  }
}

export default CanvasRenderer

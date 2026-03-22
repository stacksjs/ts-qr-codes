import { merge } from '../utils/merge'

export function getEncodingHeight(encoding: any, options: any): number {
  return options.height
    + ((options.displayValue && encoding.text.length > 0) ? options.fontSize + options.textMargin : 0)
    + options.marginTop
    + options.marginBottom
}

export function getBarcodePadding(textWidth: number, barcodeWidth: number, options: any): number {
  if (options.displayValue && barcodeWidth < textWidth) {
    if (options.textAlign === 'center') {
      return Math.floor((textWidth - barcodeWidth) / 2)
    }

    if (options.textAlign === 'left') {
      return 0
    }

    if (options.textAlign === 'right') {
      return Math.floor(textWidth - barcodeWidth)
    }
  }

  return 0
}

export function calculateEncodingAttributes(encodings: any, barcodeOptions: any, context?: any): void {
  for (let i = 0; i < encodings.length; i++) {
    const encoding = encodings[i]
    const options = merge(barcodeOptions, encoding.options)

    // Calculate the width of the encoding
    let textWidth
    if (options.displayValue) {
      textWidth = measureText(encoding.text, options, context)
    }
    else {
      textWidth = 0
    }

    const barcodeWidth = encoding.data.length * options.width
    encoding.width = Math.ceil(Math.max(textWidth, barcodeWidth))

    encoding.height = getEncodingHeight(encoding, options)

    encoding.barcodePadding = getBarcodePadding(textWidth, barcodeWidth, options)
  }
}

export function getTotalWidthOfEncodings(encodings: any): number {
  let totalWidth = 0

  for (let i = 0; i < encodings.length; i++) {
    totalWidth += encodings[i].width
  }

  return totalWidth
}

export function getMaximumHeightOfEncodings(encodings: any): number {
  let maxHeight = 0

  for (let i = 0; i < encodings.length; i++) {
    if (encodings[i].height > maxHeight) {
      maxHeight = encodings[i].height
    }
  }

  return maxHeight
}

function measureText(string: string, options: any, context?: any): number {
  let ctx

  if (context) {
    ctx = context
  }
  else if (typeof document !== 'undefined') {
    ctx = document.createElement('canvas').getContext('2d')
  }
  else {
    // If the text cannot be measured we will return 0.
    // This will make some barcode with big text render incorrectly
    return 0
  }

  ctx.font = `${options.fontOptions} ${options.fontSize}px ${options.font}`

  // Calculate the width of the encoding
  const measureTextResult = ctx.measureText(string)

  if (!measureTextResult) {
    // Some implementations don't implement measureText and return undefined.
    // If the text cannot be measured we will return 0.
    // This will make some barcode with big text render incorrectly
    return 0
  }

  const size = measureTextResult.width

  return size
}

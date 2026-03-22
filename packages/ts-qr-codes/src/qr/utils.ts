/**
 * Helper function to determine if the current browser supports the Canvas API.
 */
export function isSupportCanvas(): boolean {
  return typeof CanvasRenderingContext2D !== 'undefined'
}

/**
 * Helper function to detect Android versions (workarounds for older Android).
 */
export function getAndroid(): number | false {
  const sAgent = navigator.userAgent.toLowerCase()

  if (sAgent.includes('android')) {
    // Try to grab the version number
    const match = sAgent.match(/android (\d\.\d)/i)
    if (match && match[1]) {
      return Number.parseFloat(match[1])
    }

    return 1 // No version number found
  }

  return false
}

/**
 * Returns the length of text when encoded in UTF-8, plus BOM if needed.
 */
export function getUTF8Length(sText: string): number {
  const replacedText = encodeURI(sText).toString().replace(/%[0-9a-f]{2}/gi, 'a')
  return replacedText.length + (replacedText.length !== sText.length ? 3 : 0)
}

import { BINARIES } from './constants'

// Encode data string
export function encode(data: string, structure: string, separator?: string): string {
  let encoded = data
    .split('')
    .map((_val, idx) => BINARIES[structure[idx]] || '') // Ensure valid access
    // @ts-expect-error should be able to improve this
    .map((val, idx) => val ? val[data[idx]] : '')

  if (separator) {
    const last = data.length - 1
    encoded = encoded.map((val, idx) => (
      idx < last ? val + separator : val
    ))
  }

  return encoded.join('')
}

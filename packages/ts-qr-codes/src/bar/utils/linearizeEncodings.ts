// Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
// Convert to [1-1, 1-2, 2, 3-1, 3-2]
export function linearizeEncodings(encodings: any[]): any[] {
  const linearEncodings: any[] = []

  function nextLevel(encoded: any) {
    if (Array.isArray(encoded)) {
      for (let i = 0; i < encoded.length; i++) {
        nextLevel(encoded[i])
      }
    }
    else {
      encoded.text = encoded.text || ''
      encoded.data = encoded.data || ''
      linearEncodings.push(encoded)
    }
  }

  nextLevel(encodings)

  return linearEncodings
}

export default linearizeEncodings

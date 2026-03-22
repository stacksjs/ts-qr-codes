export function mod10(number: string): number {
  let sum = 0

  for (let i = 0; i < number.length; i++) {
    const n = Number.parseInt(number[i])
    if ((i + number.length) % 2 === 0) {
      sum += n
    }
    else {
      sum += (n * 2) % 10 + Math.floor((n * 2) / 10)
    }
  }

  return (10 - (sum % 10)) % 10
}

export function mod11(number: string): number {
  let sum = 0
  const weights = [2, 3, 4, 5, 6, 7]

  for (let i = 0; i < number.length; i++) {
    const n = Number.parseInt(number[number.length - 1 - i])
    sum += weights[i % weights.length] * n
  }

  return (11 - (sum % 11)) % 11
}

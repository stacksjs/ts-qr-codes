import ITF from './ITF'

// Calculate the checksum digit
function checksum(data: string): number {
  const res = data
    .substr(0, 13)
    .split('')
    .map(num => Number.parseInt(num, 10))
    .reduce((sum, n, idx) => sum + (n * (3 - (idx % 2) * 2)), 0)

  return Math.ceil(res / 10) * 10 - res
}

class ITF14 extends ITF {
  constructor(data: string, options: any) {
    // Add checksum if it does not exist
    if (data.search(/^\d{13}$/) !== -1) {
      data += checksum(data)
    }

    super(data, options)
  }

  valid(): boolean {
    return (
      this.data.search(/^\d{14}$/) !== -1
      && +this.data[13] === checksum(this.data)
    )
  }
}

export default ITF14

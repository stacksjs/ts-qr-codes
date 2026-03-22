import CODE128 from './CODE128'
import { C_CHARS, C_START_CHAR } from './constants'

class CODE128C extends CODE128 {
  constructor(string: string, options: any) {
    super(C_START_CHAR + string, options)
  }

  valid(): boolean {
    return (new RegExp(`^${C_CHARS}+$`)).test(this.data)
  }
}

export default CODE128C

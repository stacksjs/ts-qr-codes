import CODE128 from './CODE128'
import { B_CHARS, B_START_CHAR } from './constants'

class CODE128B extends CODE128 {
  constructor(string: string, options: any) {
    super(B_START_CHAR + string, options)
  }

  valid(): boolean {
    return (new RegExp(`^${B_CHARS}+$`)).test(this.data)
  }
}

export default CODE128B

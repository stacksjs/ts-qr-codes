import CODE128 from './CODE128'
import { A_CHARS, A_START_CHAR } from './constants'

class CODE128A extends CODE128 {
  constructor(string: string, options: any) {
    super(A_START_CHAR + string, options)
  }

  valid(): boolean {
    return (new RegExp(`^${A_CHARS}+$`)).test(this.data)
  }
}

export default CODE128A

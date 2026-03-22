import { mod11 } from './checksums'
import MSI from './MSI'

class MSI11 extends MSI {
  constructor(data: string, options: any) {
    super(data + mod11(data), options)
  }
}

export default MSI11

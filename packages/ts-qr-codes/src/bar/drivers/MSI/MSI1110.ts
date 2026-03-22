import { mod10, mod11 } from './checksums'
import MSI from './MSI'

class MSI1110 extends MSI {
  constructor(data: string, options: any) {
    data += mod11(data)
    data += mod10(data)
    super(data, options)
  }
}

export default MSI1110

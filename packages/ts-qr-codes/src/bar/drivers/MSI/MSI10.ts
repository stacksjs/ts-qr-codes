import { mod10 } from './checksums'
import MSI from './MSI'

class MSI10 extends MSI {
  constructor(data: string, options: any) {
    super(data + mod10(data), options)
  }
}

export default MSI10

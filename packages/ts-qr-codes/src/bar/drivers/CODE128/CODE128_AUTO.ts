import autoSelectModes from './auto'
import CODE128 from './CODE128'

class CODE128AUTO extends CODE128 {
  constructor(data: string, options: any) {
    // ASCII value ranges 0-127, 200-211
    // eslint-disable-next-line no-control-regex
    if (/^[\x00-\x7F\xC8-\xD3]+$/.test(data)) {
      super(autoSelectModes(data), options)
    }
    else {
      super(data, options)
    }
  }
}

export default CODE128AUTO

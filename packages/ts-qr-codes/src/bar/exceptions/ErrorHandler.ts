export class ErrorHandler {
  api: any

  constructor(api: any) {
    this.api = api
  }

  handleCatch(e: any): void {
    // If babel supported extending of Error in a correct way instanceof would be used here
    if (e.name === 'InvalidInputException') {
      if (this.api._options.valid !== this.api._defaults.valid) {
        this.api._options.valid(false)
      }
      else {
        throw e.message
      }
    }
    else {
      throw e
    }

    this.api.render = function () {}
  }

  wrapBarcodeCall(func: any, ...args: any[]): any {
    try {
      const result = func(...args)
      this.api._options.valid(true)
      return result
    }
    catch (e) {
      this.handleCatch(e)
      return this.api
    }
  }
}

export default ErrorHandler

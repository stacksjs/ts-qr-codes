export interface FixOptions {
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginRight?: number
  marginLeft?: number
}

export function fixOptions(options: FixOptions): any {
  // Fix the margins
  options.marginTop = options.marginTop || options.margin
  options.marginBottom = options.marginBottom || options.margin
  options.marginRight = options.marginRight || options.margin
  options.marginLeft = options.marginLeft || options.margin

  return options
}

export default fixOptions

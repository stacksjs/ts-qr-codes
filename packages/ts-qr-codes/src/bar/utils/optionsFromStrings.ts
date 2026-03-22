// Convert string to integers/booleans where it should be
export function optionsFromStrings(options: any): any {
  const intOptions = [
    'width',
    'height',
    'textMargin',
    'fontSize',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
  ]

  for (let intOption in intOptions) {
    if (Object.prototype.hasOwnProperty.call(intOptions, intOption)) {
      intOption = intOptions[intOption]
      if (typeof options[intOption] === 'string') {
        options[intOption] = Number.parseInt(options[intOption], 10)
      }
    }
  }

  if (typeof options.displayValue === 'string') {
    options.displayValue = (options.displayValue !== 'false')
  }

  return options
}

export default optionsFromStrings

import { defaults } from '../../config'
import optionsFromStrings from './optionsFromStrings'

export function getOptionsFromElement(element: HTMLElement): any {
  let options: { [key: string]: any } = {}

  for (const property in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, property)) {
      // jsbarcode-*
      if (element.hasAttribute(`jsbarcode-${property.toLowerCase()}`)) {
        options[property] = element.getAttribute(`jsbarcode-${property.toLowerCase()}`)
      }

      // data-*
      if (element.hasAttribute(`data-${property.toLowerCase()}`)) {
        options[property] = element.getAttribute(`data-${property.toLowerCase()}`)
      }
    }
  }

  options.value = element.getAttribute('jsbarcode-value') || element.getAttribute('data-value')

  // Since all attributes are string they need to be converted to integers
  options = optionsFromStrings(options)

  return options
}

export default getOptionsFromElement

import { InvalidElementException } from '../exceptions/exceptions'
import renderers from '../renderers/index'
import getOptionsFromElement from './getOptionsFromElement'

// Takes an element and returns an object with information about how
// it should be rendered
// This could also return an array with these objects
// {
//   element: The element that the renderer should draw on
//   renderer: The name of the renderer
//   afterRender (optional): If something has to done after the renderer
//     completed, calls afterRender (function)
//   options (optional): Options that can be defined in the element
// }

export function getRenderProperties(element: any): any {
  // If the element is a string, query select call again
  if (typeof element === 'string') {
    return querySelectedRenderProperties(element)
  }

  // If element is array. Recursively call with every object in the array
  if (Array.isArray(element)) {
    const returnArray = []

    for (let i = 0; i < element.length; i++) {
      returnArray.push(getRenderProperties(element[i]))
    }

    return returnArray
  }

  // If element, render on canvas and set the uri as src
  if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLImageElement) {
    return newCanvasRenderProperties(element)
  }

  // If SVG
  if (
    (element && element.nodeName && element.nodeName.toLowerCase() === 'svg')
    || (typeof SVGElement !== 'undefined' && element instanceof SVGElement)
  ) {
    return {
      element,
      options: getOptionsFromElement(element),
      renderer: renderers.SVGRenderer,
    }
  }

  // If canvas (in browser)
  if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLCanvasElement) {
    return {
      element,
      options: getOptionsFromElement(element),
      renderer: renderers.CanvasRenderer,
    }
  }

  // If canvas (in node)
  if (element && element.getContext) {
    return {
      element,
      renderer: renderers.CanvasRenderer,
    }
  }

  if (element && typeof element === 'object' && !element.nodeName) {
    return {
      element,
      renderer: renderers.ObjectRenderer,
    }
  }

  throw new InvalidElementException()
}

function querySelectedRenderProperties(string: string): any {
  const selector = document.querySelectorAll(string)
  if (selector.length === 0) {
    return undefined
  }
  else {
    const returnArray = []
    for (let i = 0; i < selector.length; i++) {
      returnArray.push(getRenderProperties(selector[i]))
    }
    return returnArray
  }
}

function newCanvasRenderProperties(imgElement: HTMLImageElement): any {
  const canvas = document.createElement('canvas')
  return {
    element: canvas,
    options: getOptionsFromElement(imgElement),
    renderer: renderers.CanvasRenderer,
    afterRender() {
      imgElement.setAttribute('src', canvas.toDataURL())
    },
  }
}

export default getRenderProperties

import CanvasRenderer from './canvas'
import ObjectRenderer from './object'
import SVGRenderer from './svg'

interface Renderers {
  CanvasRenderer: typeof CanvasRenderer
  ObjectRenderer: typeof ObjectRenderer
  SVGRenderer: typeof SVGRenderer
}

const renderers: Renderers = {
  CanvasRenderer,
  ObjectRenderer,
  SVGRenderer,
}

export { CanvasRenderer, ObjectRenderer, SVGRenderer }

export default renderers

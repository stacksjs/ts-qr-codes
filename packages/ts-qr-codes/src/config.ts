import type { QRConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaults: QRConfig = {
  type: 'qr',

  options: {
    width: 100,
    height: 100,
    format: 'auto',
    displayValue: true,
    fontOptions: '',
    font: 'monospace',
    text: '',
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontSize: 20,
    background: '#ffffff',
    lineColor: '#000000',
    margin: 10,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined,
    valid() { },
    flat: false,
    ean128: false,
    elementTag: 'svg',
  },
}
// eslint-disable-next-line import/no-mutable-exports
export let config: QRConfig = defaults
  ; (async () => {
  config = await loadConfig({
    name: 'qr',
    defaultConfig: defaults,
  })
})()

// export const config: QRConfig = await loadConfig({
//   name: 'qrx',
//   defaultConfig: defaults,
// })

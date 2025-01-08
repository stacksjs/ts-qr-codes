import type { QrxConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaults: QrxConfig = {
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
export let config: QrxConfig = defaults
  ; (async () => {
  config = await loadConfig({
    name: 'qrx',
    defaultConfig: defaults,
  })
})()

// export const config: QrxConfig = await loadConfig({
//   name: 'qrx',
//   defaultConfig: defaults,
// })

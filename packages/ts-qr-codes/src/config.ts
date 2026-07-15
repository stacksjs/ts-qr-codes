import type { QRConfig } from './types'

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
/**
 * The active config.
 *
 * This module is part of the browser build, so it resolves to `defaults`.
 * Reading a `qr.config.ts` file is a filesystem concern — importing bunfig
 * here pulled node builtins (`stream/promises`) into the browser bundle and
 * broke the build. Load file config explicitly with `loadQRConfig()` from
 * `./config-loader` (Bun/node only).
 */
export const config: QRConfig = defaults

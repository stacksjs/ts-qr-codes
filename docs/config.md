# Configuration

`qrx` can be configured using a `qrx.config.ts` _(or `qrx.config.js`)_ file and it will be automatically loaded when running the `qrx` command.

```ts
// qrx.config.{ts,js}
import type { QRConfig } from 'ts-qr-codes'
import os from 'node:os'
import path from 'node:path'

const config: QRConfig = {
  /**
   * The type of the QR code.
   */
  type: 'qr', // 'qr' | 'bar'

  options: {
    /**
     * The width of the QR code.
     */
    width: 2,
    /**
     * The height of the QR code.
     */
    height: 100,
    /**
     * The format of the QR code.
     */
    format: 'auto',
    /**
     * Whether to display the value in the QR code.
     */
    displayValue: true,
    /**
     * The font options for the QR code.
     */
    fontOptions: '',
    /**
     * The font for the QR code.
     */
    font: 'monospace',
    /**
     * The text for the QR code.
     */
    text: undefined,
    /**
     * The text alignment for the QR code.
     */
    textAlign: 'center', // 'left' | 'center' | 'right'
    /**
     * The text position for the QR code.
     */
    textPosition: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
    /**
     * The text margin for the QR code.
     */
    textMargin: 2,
    /**
     * The font size for the QR code.
     */
    fontSize: 20,
    /**
     * The background color for the QR code.
     */
    background: '#ffffff',
    /**
     * The line color for the QR code.
     */
    lineColor: '#000000',
    /**
     * The margin for the QR code.
     */
    margin: 10,
    /**
     * The margin top for the QR code.
     */
    marginTop: undefined,
    /**
     * The margin right for the QR code.
     */
    marginBottom: undefined,
    /**
     * The margin left for the QR code.
     */
    marginLeft: undefined,
    /**
     * The margin right for the QR code.
     */
    marginRight: undefined,
    /**
     * The error correction level for the QR code.
     */
    valid() { },
  },
}

export default config
```

_Then run:_

```bash
./rpx start
```

To learn more, head over to the [documentation](https://ts-quick-reaction.netlify.app).

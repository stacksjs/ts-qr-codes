# Get Started

There are two ways of using this QR & Bar Code tool: _as a library or as a CLI._

## Library

Given the npm package is installed:

### QR Code

```html
<div id="qr-code"></div>

<script type="text/javascript">
new QRCode(document.getElementById("qr-code"), "https://stacksjs.org");
</script>
```

If you want to customize the QR code, you can pass in an options object:

```html
<div id="qr-code"></div>

<script type="text/javascript">
const options = {
  width: 2,
  height: 100,
  format: 'auto',
  displayValue: true,
  fontOptions: '',
  font: 'monospace',
  text: undefined,
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
}

var qrCode = new QRCode(document.getElementById("qr-code"), options);
</script>
```

You can also use methods to interact with the QR code:

```ts
qrCode.clear() // clear the code
qrCode.makeCode('https://docs.stacksjs.org') // create another code
```

### Barcode

A lightweight Barcode library with zero dependencies. It supports multiple barcode formats and works in browsers and with _Node.js & Bun_.

#### Supported Formats

- [CODE128](https://ts-quick-reaction.netlify.app/api/barcode/CODE128)
  - CODE128 (automatic mode switching)
  - CODE128 A/B/C (force mode)
- [EAN](https://ts-quick-reaction.netlify.app/api/barcode/EAN)
  - EAN-13
  - EAN-8
  - EAN-5
  - EAN-2
  - UPC (A)
  - UPC (E)
- [CODE39](https://ts-quick-reaction.netlify.app/api/barcode/CODE39)
- [ITF](https://ts-quick-reaction.netlify.app/api/barcode/ITF-14)
  - ITF
  - ITF-14
- [MSI](https://ts-quick-reaction.netlify.app/api/barcode/MSI)
  - MSI10
  - MSI11
  - MSI1010
  - MSI1110
- [Pharmacode](https://ts-quick-reaction.netlify.app/api/barcode/pharmacode)
- [Codabar](https://ts-quick-reaction.netlify.app/api/barcode/codabar)

#### Browser Example

````html
<svg id="barcode"></svg>
<!-- or -->
<canvas id="barcode"></canvas>
<!-- or -->
<img id="barcode"/>
````

##### Simple example

```ts
barcode('#barcode', 'Hi!')
```

![Result](https://s3-eu-west-1.amazonaws.com/js-barcode/barcodes/simple.svg)

#### Example with options

```ts
Barcode('#barcode', '1234', {
  format: 'pharmacode',
  lineColor: '#0aa',
  width: 4,
  height: 40,
  displayValue: false
})
```

![Result](https://s3-eu-west-1.amazonaws.com/js-barcode/barcodes/advanced.svg)

#### More advanced use case

```ts
barcode('#barcode')
  .options({ font: 'OCR-B' }) // Will affect all barcodes
  .EAN13('1234567890128', { fontSize: 18, textMargin: 0 })
  .blank(20) // Create space between the barcodes
  .EAN5('12345', { height: 85, textPosition: 'top', fontSize: 16, marginTop: 15 })
  .render()
```

![Result](https://s3-eu-west-1.amazonaws.com/js-barcode/barcodes/simple.svg)

#### Or define the value and options in the HTML element

Use any `barcode-*` or `data-*` as attributes where `*` is any option.

````html
<svg
  class="barcode"
  barcode-format="upc"
  barcode-value="123456789012"
  barcode-text-margin="0"
  barcode-font-options="bold"
></svg>
````

And then initialize it with:

```ts
barcode('.barcode').init()
```

![Result](https://s3-eu-west-1.amazonaws.com/js-barcode/barcodes/init.svg)

#### Retrieve the barcode values so you can render it any way you'd like

Pass in an object which will be filled with data.

```ts
const data = {}
barcode(data, 'text', { ...options })
```

data will be filled with a ``` encodings ``` property which has all the needed values. See docs for examples of what data looks like.

#### Node.js & Bun

----

#### With canvas

```ts
import { barcode } from 'ts-qr-codes'
import { createCanvas } from 'canvas'

const canvas = createCanvas()

barcode(canvas, 'Hello')

// As this is a node-canvas, you can configure it as you like:
// see https://github.com/Automattic/node-canvas for more information
```

#### With svg

```ts
import { DOMImplementation, XMLSerializer } from 'xmldom'

const xmlSerializer = new XMLSerializer()
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

barcode(svgNode, 'test', {
  xmlDocument: document,
})

const svgText = xmlSerializer.serializeToString(svgNode)
```

#### Options

For information about how to use the options, see the docs.

| Option | Default value | Type |
|--------|---------------|------|
| [`format`](https://ts-quick-reaction.netlify.app/api/barcode/#format) | `"auto" (CODE128)` | `String` |
| [`width`](https://ts-quick-reaction.netlify.app/api/barcode/#width) | `2` | `Number` |
| [`height`](https://ts-quick-reaction.netlify.app/api/barcode/#height) | `100` | `Number` |
| [`displayValue`](https://ts-quick-reaction.netlify.app/api/barcode/#display-value) | `true` | `Boolean` |
| [`text`](https://ts-quick-reaction.netlify.app/api/barcode/#text) | `undefined` | `String` |
| [`fontOptions`](https://ts-quick-reaction.netlify.app/api/barcode/#font-options) | `""` | `String` |
| [`font`](https://ts-quick-reaction.netlify.app/api/barcode/#font) | `"monospace"` | `String` |
| [`textAlign`](https://ts-quick-reaction.netlify.app/api/barcode/#text-align) | `"center"` | `String` |
| [`textPosition`](https://ts-quick-reaction.netlify.app/api/barcode/#text-position) | `"bottom"` | `String` |
| [`textMargin`](https://ts-quick-reaction.netlify.app/api/barcode/#text-margin) | `2` | `Number` |
| [`fontSize`](https://ts-quick-reaction.netlify.app/api/barcode/#font-size) | `20` | `Number` |
| [`background`](https://ts-quick-reaction.netlify.app/api/barcode/#background)  | `"#ffffff"` | `String (CSS color)` |
| [`lineColor`](https://ts-quick-reaction.netlify.app/api/barcode/#line-color) | `"#000000"` | `String (CSS color)` |
| [`margin`](https://ts-quick-reaction.netlify.app/api/barcode/#margins) | `10` | `Number` |
| [`marginTop`](https://ts-quick-reaction.netlify.app/api/barcode/#margins) | `undefined` | `Number` |
| [`marginBottom`](https://ts-quick-reaction.netlify.app/api/barcode/#margins) | `undefined` | `Number` |
| [`marginLeft`](https://ts-quick-reaction.netlify.app/api/barcode/#margins) | `undefined` | `Number` |
| [`marginRight`](https://ts-quick-reaction.netlify.app/api/barcode/#margins) | `undefined` | `Number` |
| [`valid`](https://ts-quick-reaction.netlify.app/api/barcode/#valid) | `function(valid){}` | `Function` |

## CLI

```bash
rpx --from localhost:3000 --to my-project.localhost
rpx --from localhost:8080 --to my-project.test --keyPath ./key.pem --certPath ./cert.pem
rpx --help
rpx --version
```

## Testing

```bash
bun test
```

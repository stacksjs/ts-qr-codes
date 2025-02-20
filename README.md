<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# qrx

> A QR & Barcode Library & CLI for Node.js/Bun/Browser.

## Features

- 🤖 **QR Code**: Customizable Generation & Reading
- 📊 **Barcode**: `CODE128`, `EAN`, `EAN-13`, `EAN-8`, `EAN-5`, `EAN-2`, `UPC (A)`, `CODE39`, `ITF-14`, `MSI`, `Pharmacode`, `Codabar`—Generation & Reading
- 📦 **Lightweight**: Zero dependencies
- 🚀 **Fast**: Built with performance in mind
- 📜 **TypeScript**: Strongly typed
- 📚 **Simple**: Easy to use
- 📖 **Documentation**: Well-documented
- 🛠 **Library & CLI**: Interact in different ways

## Install

It's simple to install the library and CLI:

```sh
npm install qrx
bun add qrx
yarn add qrx
pnpm add qrx
```

_Check out the package.json scripts for more commands._

## Usage

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

````javascript
barcode('#barcode', 'Hi!')
````

![Result](https://s3-eu-west-1.amazonaws.com/js-barcode/barcodes/simple.svg)

#### Example with options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234', {
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
import { barcode } from '@stacksjs/qrx'

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
import { barcode } from '@stacksjs/qrx'
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

Barcode(svgNode, 'test', {
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

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/qrx/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/qrx/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where `qrx` is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credit

Many thanks for the libraries that laid the groundwork:

- **JsBarcode**: <https://github.com/lindell/JsBarcode>
- **Quagga**: <https://github.com/ericblade/quagga2>
- **QRCode.js**: <https://github.com/davidshimjs/qrcodejs>

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stacksjs/qrx?style=flat-square
[npm-version-href]: https://npmjs.com/package/@stacksjs/qrx
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/qrx/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/qrx/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/qrx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/qrx -->

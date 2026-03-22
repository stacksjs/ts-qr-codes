# Getting Started

qrx is a lightweight, zero-dependency library for generating and reading QR codes and barcodes in browsers, Node.js, and Bun.

## Installation

Install qrx using your preferred package manager:

::: code-group

```bash [npm]
npm install ts-qr-codes
```

```bash [bun]
bun add ts-qr-codes
```

```bash [yarn]
yarn add ts-qr-codes
```

```bash [pnpm]
pnpm add ts-qr-codes
```

:::

## Quick Start

### Generate a QR Code

```html
<div id="qr-code"></div>

<script type="module">
import { QRCode } from 'ts-qr-codes'

new QRCode(document.getElementById('qr-code'), 'https://stacksjs.org')
</script>
```

### Generate a Barcode

```html
<svg id="barcode"></svg>

<script type="module">
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Hello World!')
</script>
```

## Features

- **Zero Dependencies** - Lightweight and fast
- **Multiple Formats** - QR codes and 12+ barcode formats
- **Universal** - Works in browsers, Node.js, and Bun
- **TypeScript** - Fully typed API
- **Customizable** - Extensive styling options

## QR Code Basics

Create a simple QR code:

```typescript
import { QRCode } from 'ts-qr-codes'

// Simple usage
new QRCode(document.getElementById('qr'), 'https://example.com')

// With options
new QRCode(document.getElementById('qr'), {
  text: 'https://example.com',
  width: 256,
  height: 256,
  colorDark: '#000000',
  colorLight: '#ffffff'
})
```

### QR Code Methods

```typescript
const qr = new QRCode(element, options)

// Clear the QR code
qr.clear()

// Generate a new QR code
qr.makeCode('https://docs.stacksjs.org')
```

## Barcode Basics

Generate various barcode formats:

```typescript
import { barcode } from 'ts-qr-codes'

// Simple CODE128 barcode
barcode('#barcode', 'Hello World!')

// With options
barcode('#barcode', '1234567890128', {
  format: 'EAN13',
  lineColor: '#0aa',
  width: 2,
  height: 100,
  displayValue: true
})
```

### Supported Barcode Formats

| Format | Description | Example |
|--------|-------------|---------|
| CODE128 | General purpose | `CODE128` |
| EAN-13 | Product identification | `5901234123457` |
| EAN-8 | Shortened product code | `96385074` |
| UPC-A | US product code | `042100005264` |
| CODE39 | Alphanumeric | `CODE39` |
| ITF-14 | Shipping containers | `1234567890123` |
| MSI | Inventory tracking | `1234` |
| Pharmacode | Pharmaceutical | `1234` |
| Codabar | Libraries, blood banks | `A1234B` |

## Rendering Targets

### SVG (Recommended)

```html
<svg id="barcode"></svg>

<script>
barcode('#barcode', 'Hello')
</script>
```

### Canvas

```html
<canvas id="barcode"></canvas>

<script>
barcode('#barcode', 'Hello')
</script>
```

### Image

```html
<img id="barcode">

<script>
barcode('#barcode', 'Hello')
</script>
```

## Server-Side Usage

### With Canvas (Node.js/Bun)

```typescript
import { barcode } from 'ts-qr-codes'
import { createCanvas } from 'canvas'

const canvas = createCanvas(200, 100)
barcode(canvas, 'Hello')

// Export as PNG, etc.
```

### With SVG (Node.js/Bun)

```typescript
import { barcode } from 'ts-qr-codes'
import { DOMImplementation, XMLSerializer } from 'xmldom'

const document = new DOMImplementation()
  .createDocument('http://www.w3.org/1999/xhtml', 'html', null)
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

barcode(svgNode, 'Hello', { xmlDocument: document })

const serializer = new XMLSerializer()
const svgText = serializer.serializeToString(svgNode)
```

## HTML Attributes

Define options directly in HTML:

```html
<svg
  class="barcode"
  barcode-format="upc"
  barcode-value="123456789012"
  barcode-text-margin="0"
  barcode-font-options="bold"
></svg>

<script>
barcode('.barcode').init()
</script>
```

## Getting Barcode Data

Retrieve encoding data for custom rendering:

```typescript
const data = {}
barcode(data, 'Hello', { format: 'CODE128' })

console.log(data.encodings)
// Array of encoding objects with bars, text, etc.
```

## Next Steps

- Learn about [QR & Barcode Generation](/guide/generation)
- Explore [Reading Codes](/guide/reading)
- See [Configuration](/config) options

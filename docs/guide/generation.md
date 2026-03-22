# QR & Barcode Generation

Complete guide to generating QR codes and barcodes with qrx.

## QR Code Generation

### Basic QR Code

```typescript
import { QRCode } from 'ts-qr-codes'

// Simple text/URL
new QRCode(document.getElementById('qr'), 'https://example.com')
```

### QR Code Options

```typescript
new QRCode(document.getElementById('qr'), {
  text: 'https://example.com',
  width: 256,
  height: 256,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.H
})
```

### QR Code Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | string | - | Content to encode |
| `width` | number | 128 | Width in pixels |
| `height` | number | 128 | Height in pixels |
| `colorDark` | string | `#000000` | Foreground color |
| `colorLight` | string | `#ffffff` | Background color |
| `correctLevel` | number | L | Error correction level |

### Error Correction Levels

| Level | Recovery | Use Case |
|-------|----------|----------|
| L | 7% | Normal conditions |
| M | 15% | Some obscuring expected |
| Q | 25% | Industrial environments |
| H | 30% | Maximum reliability |

```typescript
import { QRCode } from 'ts-qr-codes'

new QRCode(element, {
  text: 'Hello',
  correctLevel: QRCode.CorrectLevel.H // Maximum error correction
})
```

### Dynamic QR Codes

Update QR codes dynamically:

```typescript
const qr = new QRCode(element, 'Initial content')

// Update content
qr.clear()
qr.makeCode('Updated content')
```

## Barcode Generation

### Basic Barcode

```typescript
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Hello World!')
```

### With Options

```typescript
barcode('#barcode', '1234', {
  format: 'pharmacode',
  lineColor: '#0aa',
  width: 4,
  height: 40,
  displayValue: false
})
```

### Barcode Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | `auto` | Barcode format |
| `width` | number | 2 | Line width |
| `height` | number | 100 | Bar height |
| `displayValue` | boolean | true | Show text below |
| `text` | string | - | Override display text |
| `fontOptions` | string | `''` | Font styling (bold, italic) |
| `font` | string | `monospace` | Font family |
| `textAlign` | string | `center` | Text alignment |
| `textPosition` | string | `bottom` | Text position |
| `textMargin` | number | 2 | Space between bars and text |
| `fontSize` | number | 20 | Font size |
| `background` | string | `#ffffff` | Background color |
| `lineColor` | string | `#000000` | Bar color |
| `margin` | number | 10 | Margin around barcode |
| `marginTop` | number | - | Top margin |
| `marginBottom` | number | - | Bottom margin |
| `marginLeft` | number | - | Left margin |
| `marginRight` | number | - | Right margin |
| `valid` | function | - | Validation callback |

## Barcode Formats

### CODE128

Versatile format for alphanumeric data.

```typescript
// Auto-detect best encoding
barcode('#bc', 'ABC-123')

// Force specific mode
barcode('#bc', 'ABC-123', { format: 'CODE128A' })
barcode('#bc', 'ABC-123', { format: 'CODE128B' })
barcode('#bc', '123456', { format: 'CODE128C' })
```

### EAN/UPC Family

Product identification codes.

```typescript
// EAN-13 (13 digits)
barcode('#bc', '5901234123457', { format: 'EAN13' })

// EAN-8 (8 digits)
barcode('#bc', '96385074', { format: 'EAN8' })

// EAN-5 (add-on)
barcode('#bc', '12345', { format: 'EAN5' })

// EAN-2 (add-on)
barcode('#bc', '12', { format: 'EAN2' })

// UPC-A (12 digits)
barcode('#bc', '042100005264', { format: 'UPC' })

// UPC-E (compressed)
barcode('#bc', '01245714', { format: 'UPCE' })
```

### CODE39

Alphanumeric with special characters.

```typescript
barcode('#bc', 'CODE39', { format: 'CODE39' })
```

Supported characters: `A-Z`, `0-9`, `-`, `.`, ` `, `$`, `/`, `+`, `%`

### ITF-14

For shipping containers (14 digits).

```typescript
barcode('#bc', '12345678901231', { format: 'ITF14' })

// Generic ITF
barcode('#bc', '1234', { format: 'ITF' })
```

### MSI

Inventory tracking (numeric only).

```typescript
barcode('#bc', '1234', { format: 'MSI' })
barcode('#bc', '1234', { format: 'MSI10' })   // Mod 10 checksum
barcode('#bc', '1234', { format: 'MSI11' })   // Mod 11 checksum
barcode('#bc', '1234', { format: 'MSI1010' }) // Double Mod 10
barcode('#bc', '1234', { format: 'MSI1110' }) // Mod 11 + Mod 10
```

### Pharmacode

Pharmaceutical packaging.

```typescript
barcode('#bc', '1234', { format: 'pharmacode' })
```

### Codabar

Libraries, blood banks, shipping.

```typescript
barcode('#bc', 'A1234B', { format: 'codabar' })
```

Start/stop characters: `A`, `B`, `C`, `D`

## Advanced Usage

### Chained API

Create multiple barcodes with shared options:

```typescript
barcode('#container')
  .options({ font: 'OCR-B' })
  .EAN13('1234567890128', { fontSize: 18, textMargin: 0 })
  .blank(20) // Add spacing
  .EAN5('12345', { height: 85, textPosition: 'top', fontSize: 16, marginTop: 15 })
  .render()
```

### Get Encoding Data

For custom rendering:

```typescript
const data = {}
barcode(data, 'Hello', { format: 'CODE128' })

// Access encoding information
console.log(data.encodings)
// [
//   {
//     data: '11010011100...',
//     text: 'Hello',
//     options: { ... }
//   }
// ]
```

### Validation

Check if input is valid:

```typescript
barcode('#bc', '123456789012', {
  format: 'EAN13',
  valid: (isValid) => {
    if (!isValid) {
      console.error('Invalid EAN-13 code')
    }
  }
})
```

## Styling Examples

### Custom Colors

```typescript
barcode('#bc', 'STYLED', {
  lineColor: '#0066cc',
  background: '#f0f0f0'
})
```

### Bold Text

```typescript
barcode('#bc', 'BOLD', {
  fontOptions: 'bold',
  fontSize: 24
})
```

### No Text Display

```typescript
barcode('#bc', '12345', {
  displayValue: false,
  height: 60
})
```

### Custom Text

```typescript
barcode('#bc', '12345678', {
  text: 'Product #12345678'
})
```

### Compact Barcode

```typescript
barcode('#bc', 'COMPACT', {
  width: 1,
  height: 40,
  fontSize: 12,
  margin: 5
})
```

## HTML Initialization

Use data attributes for declarative barcodes:

```html
<svg
  class="barcode"
  barcode-format="ean13"
  barcode-value="1234567890128"
  barcode-height="80"
  barcode-font-size="16"
></svg>

<script>
barcode('.barcode').init()
</script>
```

## Server-Side Generation

### Node.js with Canvas

```typescript
import { barcode } from 'ts-qr-codes'
import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

const canvas = createCanvas(300, 100)
barcode(canvas, 'Hello World')

writeFileSync('barcode.png', canvas.toBuffer('image/png'))
```

### Node.js with SVG

```typescript
import { barcode } from 'ts-qr-codes'
import { DOMImplementation, XMLSerializer } from 'xmldom'
import { writeFileSync } from 'fs'

const doc = new DOMImplementation()
  .createDocument('http://www.w3.org/1999/xhtml', 'html', null)
const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg')

barcode(svg, 'Hello', { xmlDocument: doc })

const serializer = new XMLSerializer()
writeFileSync('barcode.svg', serializer.serializeToString(svg))
```

## Next Steps

- Learn about [Reading Codes](/guide/reading)
- Explore [Configuration](/config) options

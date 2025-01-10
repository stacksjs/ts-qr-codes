# QR Codes

QR (Quick Response) codes are two-dimensional barcodes that can store various types of data including text, URLs, contact information, and more. qrx provides a robust QR code generation system with extensive customization options.

## Basic Usage

The simplest way to generate a QR code:

```html
<div id="qr-code"></div>

<script type="text/javascript">
import { QRCode } from '@stacksjs/qrx'

new QRCode(document.getElementById("qr-code"), "https://stacksjs.org")
</script>
```

[!NOTE] Image needed: Basic QR code example

## Advanced Configuration

Customize the QR code appearance and behavior with options:

```ts
import { QRCode } from '@stacksjs/qrx'

const options = {
  // Size Options
  width: 256, // Width in pixels
  height: 256, // Height in pixels
  margin: 10, // Margin around QR code

  // Color Options
  colorDark: '#000000', // QR code color
  colorLight: '#ffffff', // Background color

  // Error Correction
  correctLevel: QRErrorCorrectLevel.H, // H, Q, M, or L

  // Rendering
  useSVG: true, // Use SVG renderer instead of canvas
}

const qrCode = new QRCode(document.getElementById('qr-code'), options)
```

## Error Correction Levels

QR codes support four levels of error correction:

```ts
import { QRCode, QRErrorCorrectLevel } from '@stacksjs/qrx'

// Low - 7% recovery capacity
new QRCode(element, {
  correctLevel: QRErrorCorrectLevel.L
})

// Medium - 15% recovery capacity
new QRCode(element, {
  correctLevel: QRErrorCorrectLevel.M
})

// Quartile - 25% recovery capacity
new QRCode(element, {
  correctLevel: QRErrorCorrectLevel.Q
})

// High - 30% recovery capacity
new QRCode(element, {
  correctLevel: QRErrorCorrectLevel.H
})
```

[!NOTE] Image needed: Visual comparison of error correction levels

## Methods

Interact with generated QR codes:

```ts
const qrCode = new QRCode(element, options)

// Clear the QR code
qrCode.clear()

// Generate new code
qrCode.makeCode('https://docs.stacksjs.org')
```

## Data Types

QR codes can encode various types of data:

```ts
// URL
new QRCode(element, 'https://stacksjs.org')

// Plain Text
new QRCode(element, 'Hello World!')

// Contact Information (vCard)
new QRCode(element, `
BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:123-456-7890
EMAIL:john@example.com
END:VCARD
`)

// WiFi Configuration
new QRCode(element, `
WIFI:T:WPA;S:NetworkName;P:Password123;;
`)
```

[!NOTE] Image needed: Examples of different data type encodings

## Styling Options

### Size and Margins

```ts
new QRCode(element, {
  width: 256,
  height: 256,
  margin: 10,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 15,
  marginRight: 15
})
```

### Colors and Appearance

```ts
new QRCode(element, {
  colorDark: '#000000',
  colorLight: '#ffffff',
  useSVG: true
})
```

## Best Practices

1. **Error Correction**
   - Use higher levels for printed QR codes
   - Use lower levels for digital display
   - Consider environment factors

2. **Size Guidelines**
   - Minimum size: 2cm × 2cm for print
   - Maintain 1:1 aspect ratio
   - Include adequate quiet zone

3. **Content Optimization**
   - Keep data minimal
   - Use URL shorteners
   - Test scanning distance

## Common Applications

1. **Marketing**
   - Website URLs
   - Product information
   - Campaign tracking

2. **Business**
   - Digital business cards
   - Contact information
   - WiFi access

3. **Authentication**
   - Two-factor authentication
   - Ticket validation
   - Access control

[!NOTE] Image needed: Real-world application examples

## Error Handling

```ts
try {
  const qrCode = new QRCode(element, {
    text: 'https://stacksjs.org',
    width: 256,
    height: 256,
    correctLevel: QRErrorCorrectLevel.H,
    valid(valid) {
      if (!valid)
        console.error('QR code generation failed')
    }
  })
}
catch (error) {
  console.error('Error generating QR code:', error)
}
```

## Technical Specifications

1. **Version Information**
   - 40 versions (1-40)
   - Increasing data capacity
   - Module size variations

2. **Data Capacity**
   - Numeric: Up to 7,089 characters
   - Alphanumeric: Up to 4,296 characters
   - Binary: Up to 2,953 bytes
   - Kanji: Up to 1,817 characters

3. **Structure**
   - Finder patterns
   - Alignment patterns
   - Timing patterns
   - Format information
   - Data and error correction

[!NOTE] Image needed: Technical structure diagram

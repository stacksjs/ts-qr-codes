# Reading QR & Barcodes

qrx provides functionality to read and decode QR codes and barcodes from images and camera feeds.

## QR Code Reading

### From Image

Read a QR code from an image file:

```typescript
import { readQRCode } from 'ts-qr-codes'

// From image file
const result = await readQRCode('qr-code.png')
console.log(result.data) // Decoded content

// From image URL
const result = await readQRCode('https://example.com/qr.png')
```

### From Canvas

Read from an existing canvas element:

```typescript
import { readQRCode } from 'ts-qr-codes'

const canvas = document.getElementById('canvas')
const result = await readQRCode(canvas)

if (result.data) {
  console.log('Decoded:', result.data)
}
```

### From Video Stream

Read QR codes from camera:

```typescript
import { QRCodeReader } from 'ts-qr-codes'

const video = document.getElementById('video')
const reader = new QRCodeReader()

// Start camera
const stream = await navigator.mediaDevices.getUserMedia({ video: true })
video.srcObject = stream
video.play()

// Continuous scanning
reader.decodeFromVideo(video, (result) => {
  if (result) {
    console.log('Found:', result.data)
  }
})

// Stop scanning
reader.stop()
```

## Barcode Reading

### From Image

```typescript
import { readBarcode } from 'ts-qr-codes'

const result = await readBarcode('barcode.png')

console.log(result.format)  // e.g., 'CODE128', 'EAN13'
console.log(result.data)    // Decoded content
```

### With Format Hint

Improve accuracy by specifying expected format:

```typescript
const result = await readBarcode('barcode.png', {
  formats: ['EAN13', 'EAN8', 'UPC']
})
```

### From Canvas

```typescript
import { readBarcode } from 'ts-qr-codes'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

// Draw image to canvas first
const img = new Image()
img.onload = async () => {
  context.drawImage(img, 0, 0)

  const result = await readBarcode(canvas)
  console.log(result)
}
img.src = 'barcode.jpg'
```

## Camera Scanning

### Basic Camera Scanner

```typescript
import { BarcodeScanner } from 'ts-qr-codes'

const scanner = new BarcodeScanner({
  video: document.getElementById('camera'),
  formats: ['QR_CODE', 'CODE128', 'EAN13']
})

scanner.onDetected((result) => {
  console.log('Detected:', result.data)
  console.log('Format:', result.format)
})

// Start scanning
await scanner.start()

// Stop scanning
scanner.stop()
```

### With Overlay

Add visual feedback for detected codes:

```typescript
const scanner = new BarcodeScanner({
  video: document.getElementById('camera'),
  overlay: document.getElementById('overlay'),
  showBoundingBox: true,
  formats: ['QR_CODE']
})

scanner.onDetected((result, boundingBox) => {
  // boundingBox contains position information
  console.log(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)
})

await scanner.start()
```

### Camera Selection

Choose specific camera:

```typescript
// Get available cameras
const cameras = await BarcodeScanner.getCameras()
console.log(cameras) // [{ deviceId: '...', label: 'Front Camera' }, ...]

// Use specific camera
const scanner = new BarcodeScanner({
  video: videoElement,
  deviceId: cameras[1].deviceId // Use back camera
})
```

### Torch Control

Control device flashlight:

```typescript
const scanner = new BarcodeScanner({ video: videoElement })
await scanner.start()

// Toggle torch
await scanner.toggleTorch()

// Explicit control
await scanner.setTorch(true)  // On
await scanner.setTorch(false) // Off
```

## Reading Options

### Supported Formats

| Format | Type | Description |
|--------|------|-------------|
| `QR_CODE` | 2D | QR Code |
| `CODE128` | 1D | General purpose |
| `EAN13` | 1D | European product code |
| `EAN8` | 1D | Shortened EAN |
| `UPC` | 1D | US product code |
| `CODE39` | 1D | Alphanumeric |
| `ITF` | 1D | Interleaved 2 of 5 |
| `CODABAR` | 1D | Numeric with special chars |

### Reader Options

```typescript
const options = {
  // Formats to detect
  formats: ['QR_CODE', 'CODE128'],

  // Try harder to find codes (slower but more accurate)
  tryHarder: true,

  // Character set for decoding
  characterSet: 'UTF-8',

  // Invert colors (for inverted codes)
  inverted: false,

  // Return multiple codes if found
  multiple: false
}

const result = await readBarcode('image.png', options)
```

## Result Object

```typescript
interface ReadResult {
  // Decoded content
  data: string

  // Format of the code
  format: string

  // Raw bytes (for binary data)
  rawBytes?: Uint8Array

  // Bounding box location
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }

  // Corner points
  cornerPoints?: Array<{ x: number; y: number }>
}
```

## Error Handling

```typescript
import { readQRCode, ReaderError } from 'ts-qr-codes'

try {
  const result = await readQRCode('image.png')

  if (!result.data) {
    console.log('No QR code found')
  }
  else {
    console.log('Decoded:', result.data)
  }
}
catch (error) {
  if (error instanceof ReaderError) {
    console.error('Reading failed:', error.message)
  }
}
```

## Browser Compatibility

Camera access requires:
- HTTPS (or localhost)
- User permission
- `getUserMedia` support

```typescript
// Check for camera support
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('Camera not supported')
}

// Request permission
try {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  // Permission granted
  stream.getTracks().forEach(track => track.stop())
}
catch (error) {
  console.error('Camera access denied')
}
```

## Complete Example

### QR Code Scanner Component

```html
<div id="scanner">
  <video id="camera"></video>
  <div id="result"></div>
  <button id="start">Start</button>
  <button id="stop">Stop</button>
</div>

<script type="module">
import { BarcodeScanner } from 'ts-qr-codes'

const scanner = new BarcodeScanner({
  video: document.getElementById('camera'),
  formats: ['QR_CODE']
})

scanner.onDetected((result) => {
  document.getElementById('result').textContent = result.data
})

document.getElementById('start').onclick = () => scanner.start()
document.getElementById('stop').onclick = () => scanner.stop()
</script>
```

### Batch Processing

```typescript
import { readBarcode } from 'ts-qr-codes'

async function processBarcodes(imageFiles) {
  const results = []

  for (const file of imageFiles) {
    try {
      const result = await readBarcode(file)
      results.push({
        file: file,
        data: result.data,
        format: result.format
      })
    }
    catch (error) {
      results.push({
        file: file,
        error: error.message
      })
    }
  }

  return results
}
```

## Next Steps

- Review [Generation](/guide/generation) for creating codes
- Explore [Configuration](/config) options

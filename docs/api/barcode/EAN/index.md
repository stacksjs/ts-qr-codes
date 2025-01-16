# EAN & UPC Barcodes

EAN _(European Article Number)_ and UPC _(Universal Product Code)_ are standardized barcodes used worldwide for retail products. These barcode systems are managed by GS1 and are crucial for product identification in retail environments.

## Supported Formats

qrx supports the following EAN/UPC formats:

- [EAN-13](/api/barcode/EAN/EAN-13) _(GTIN-13)_
- [EAN-8](/api/barcode/EAN/EAN-8)
- [EAN-5](/api/barcode/EAN/EAN-5) _(Add-on)_
- [EAN-2](/api/barcode/EAN/EAN-2) _(Add-on)_
- [UPC-A](/api/barcode/EAN/UPC-A)
- [UPC-E](/api/barcode/EAN/UPC-E)

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

// EAN-13 example
barcode('#barcode', '5901234123457', { format: 'EAN13' })

// UPC example
barcode('#barcode', '123456789999', { format: 'UPC' })

// EAN-8 example
barcode('#barcode', '96385074', { format: 'EAN8' })

// Add-on examples
barcode('#barcode', '54495', { format: 'EAN5' })
barcode('#barcode', '53', { format: 'EAN2' })
```

## Common Options

All EAN/UPC formats support these basic options:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '5901234123457', {
  format: 'EAN13',
  width: 2, // Bar width
  height: 100, // Barcode height
  displayValue: true, // Show text below barcode
  fontSize: 20, // Text size
  font: 'monospace', // Text font
  textAlign: 'center', // Text alignment
  textPosition: 'bottom', // Text position
  background: '#ffffff', // Background color
  lineColor: '#000000', // Bar color
  flat: false, // Remove guard bars if true
})
```

## Add-on Barcodes

EAN-5 and EAN-2 are supplemental barcodes typically used with EAN-13 or UPC-A. They can be combined using the advanced syntax:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode')
  .EAN13('1234567890128')
  .blank(20) // Creates space between barcodes
  .EAN5('12345', {
    height: 85,
    textPosition: 'top',
    fontSize: 16
  })
  .render()
```

[!NOTE] Image needed: Example of combined EAN-13 and EAN-5 barcodes

## Flat Option

EAN-13, EAN-8, and UPC formats support a `flat` option to remove guard bars:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234567890128', {
  format: 'EAN13',
  flat: true
})
```

[!NOTE] Image needed: Comparison of EAN-13 with and without guard bars

## Check Digits

[EAN-13](/api/barcode/EAN/EAN-13), [UPC](/api/barcode/EAN/UPC-A), and [EAN-8](/api/barcode/EAN/EAN-8) include a check digit for validation. If not provided, it's automatically calculated:

```ts
barcode('#barcode', '590123412345', { format: 'EAN13' })
// Automatically adds check digit: '5901234123457'
```

## OCR-B Font Support

Standard EAN/UPC barcodes typically use OCR-B font. You can specify this using @font-face:

```ts
barcode('#barcode', '123456789012', {
  format: 'EAN13',
  font: 'OCRB',
  fontSize: 18,
  textMargin: 0
})
```

[!NOTE] Remember to load the OCR-B font via @font-face before generating the barcode.

## Common Use Cases

1. Retail Products
   - Product identification
   - Inventory management
   - Point of sale scanning

2. ISBN Books
   - EAN-13 format with "978" or "979" prefix
   - Optional EAN-5 add-on for price

3. Magazines & Periodicals
   - ISSN numbers in EAN-13 format
   - EAN-2 add-on for issue numbers

## Detailed Format Documentation

For detailed information about specific formats, see:

- [EAN-13](/api/barcode/EAN/EAN-13) - 13-digit format, most common worldwide
- [EAN-8](/api/barcode/EAN/EAN-8) - 8-digit format for smaller packages
- [EAN-5](/api/barcode/EAN/EAN-5) - 5-digit supplemental barcode
- [EAN-2](/api/barcode/EAN/EAN-2) - 2-digit supplemental barcode
- [UPC-A](/api/barcode/EAN/UPC-A) - 12-digit format, common in North America
- [UPC-E](/api/barcode/EAN/UPC-E) - Compressed 8-digit format

## Technical Notes

- All formats include automatic check digit calculation
- Guard patterns are automatically added _(unless `flat: true`)_
- Text alignment and positioning can be customized
- Support for supplemental EAN-2/EAN-5 add-ons
- Automatic font sizing based on barcode dimensions

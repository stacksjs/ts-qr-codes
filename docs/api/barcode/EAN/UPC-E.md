# UPC-E

UPC-E is a zero-suppressed version of UPC-A, designed for smaller packages. It's also known as "zero compressed" UPC because it reduces a 12-digit UPC-A code into 8 digits by suppressing trailing zeros.

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '01234565', { format: 'UPCE' })
```

[!NOTE] Image needed: Basic UPC-E barcode example

## Structure

UPC-E has special compression rules:

- First digit must be 0 or 1
- Last digit is a check digit
- Middle 6 digits follow compression patterns

## Compression Patterns

UPC-E compresses UPC-A codes that end in zeros. The compression patterns are:

| UPC-E     | Expands to (UPC-A)  | Pattern    |
|-----------|---------------------|------------|
| 0123400   | 012340000000       | XX000-00YYY |
| 0123400   | 012300000004       | XX100-00YYY |
| 0123400   | 012200000003       | XX200-00YYY |
| 0123400   | 012300000000       | XXX00-000Y  |
| 0123400   | 012340000000       | XXXX0-0000  |
| 0123400   | 012345000000       | XXXXX-0005  |
| 0123400   | 012345600000       | XXXXX-0006  |
| 0123400   | 012345700000       | XXXXX-0007  |
| 0123400   | 012345800000       | XXXXX-0008  |
| 0123400   | 012345900000       | XXXXX-0009  |

## Basic Encoding

```ts
import { barcode } from '@stacksjs/qrx'

// Direct UPC-E number
barcode('#barcode', '01234565', { format: 'UPCE' })

// With number system and check digit
barcode('#barcode', '01234565', { format: 'UPCE' })
```

## Advanced Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '01234565', {
  format: 'UPCE',
  width: 2,
  height: 100,
  displayValue: true,
  font: 'OCRB',
  fontSize: 18,
  textMargin: 0,
  flat: false,
  guardHeight: 15
})
```

## Conversion Examples

```ts
import { barcode } from '@stacksjs/qrx'

// These UPC-A numbers compress to the same UPC-E
barcode('#barcode', '01200000345', { format: 'UPCE' }) // -> 01234565
barcode('#barcode', '01234500005', { format: 'UPCE' }) // -> 01234565
```

[!NOTE] Image needed: Conversion visualization

## Add-on Support

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode')
  .UPCE('01234565')
  .blank(20)
  .EAN2('12', {
    height: 85,
    textPosition: 'top'
  })
  .render()
```

[!NOTE] Image needed: UPC-E with add-on example

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '01234565', {
  format: 'UPCE',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid UPC-E')
      // Handle invalid input
    }
  }
})
```

## Best Practices

1. **Validation Rules**
   - First digit must be 0 or 1
   - Must follow compression patterns
   - Check digit must be valid
   - Total length must be 6 or 8 digits

2. **Printing Guidelines**
   - Maintain minimum size requirements
   - Ensure quiet zones
   - Use OCR-B font
   - Test scanner compatibility

## Technical Notes

1. **Size Specifications**
   - Nominal size: 22.11mm × 25.91mm
   - Magnification: 80% to 200%
   - Minimum bar width: 0.264mm
   - Quiet zones: 7x module width

2. **Conversion Guidelines**
   - Not all UPC-A codes can be compressed
   - Only specific patterns are valid
   - Maintain original UPC-A for reference

[!NOTE] Image needed: Technical specifications diagram

## Comparison with UPC-A

```ts
// UPC-A original
barcode('#barcode', '012000003456', { format: 'UPC' })

// UPC-E compressed equivalent
barcode('#barcode', '01234565', { format: 'UPCE' })
```

[!NOTE] Image needed: Side-by-side comparison of UPC-A and UPC-E

## Common Applications

1. **Small Packages**
   - Travel-size products
   - Small cosmetics
   - Limited label space

2. **Special Products**
   - Zero-suppressed items
   - Space-constrained labels
   - Small retail items

[!NOTE] Image needed: Real-world application examples

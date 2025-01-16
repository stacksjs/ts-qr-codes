# EAN-8

EAN-8 is a shortened version of EAN-13, designed for use on smaller packages where an EAN-13 barcode would be too large. It consists of 8 digits and maintains compatibility with retail scanning systems.

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '96385074', { format: 'EAN8' })
```

[!NOTE] Image needed: Basic EAN-8 barcode example

## Structure

An EAN-8 barcode consists of:

- First 2-3 digits: Country/region code
- Next 4-5 digits: Product code
- Last digit: Check digit (automatically calculated)

## Auto Check Digit

The check digit is automatically calculated if omitted:

```ts
import { barcode } from '@stacksjs/qrx'

// These generate the same barcode
barcode('#barcode', '9638507', { format: 'EAN8' }) // Auto-calculates check digit
barcode('#barcode', '96385074', { format: 'EAN8' }) // Manual check digit
```

## Advanced Options

You can customize the appearance of EAN-8 barcodes with these options:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '96385074', {
  format: 'EAN8',
  width: 2,
  height: 100,
  displayValue: true,
  font: 'OCRB',
  fontSize: 18,
  textMargin: 0,
  flat: false
})
```

## Flat Mode

Remove guard bars for special applications:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '96385074', {
  format: 'EAN8',
  flat: true
})
```

[!NOTE] Image needed: EAN-8 flat mode example

## Add-on Support

Can be combined with EAN-2 or EAN-5 supplemental barcodes:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode')
  .EAN8('96385074')
  .blank(20)
  .EAN2('12', { height: 85, textPosition: 'top' })
  .render()
```

[!NOTE] Image needed: EAN-8 with add-on example

## Common Applications

1. Small Products
   - Confectionery
   - Cosmetics
   - Small electronics

2. Space-Limited Packaging
   - Travel-size products
   - Small containers
   - Limited label space

[!NOTE] Image needed: Real-world application examples

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '96385074', {
  format: 'EAN8',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid EAN-8')
      // Handle invalid input
    }
  }
})
```

## Best Practices

1. Use only when EAN-13 is too large
2. Validate input length (7-8 digits)
3. Use OCR-B font for standard compliance
4. Ensure adequate quiet zones
5. Test scanner compatibility

## Size Comparison

[!NOTE] Image needed: Size comparison between EAN-8 and EAN-13

## Technical Notes

- Smaller data capacity than EAN-13
- Compatible with all EAN/UPC scanners
- Requires registration with GS1
- Less commonly used than EAN-13

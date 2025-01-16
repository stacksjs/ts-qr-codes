# EAN-13

EAN-13 _(European Article Number)_ is the most widely used retail barcode format globally. It consists of 13 digits and is also known as GTIN-13 (Global Trade Item Number).

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '5901234123457', { format: 'EAN13' })
```

[!NOTE] Image needed: Basic EAN-13 barcode example

## Structure

An EAN-13 barcode consists of:

- First 2-3 digits: Country/GS1 prefix
- Next 4-5 digits: Manufacturer code
- Next 5 digits: Product code
- Last digit: Check digit (automatically calculated)

## Auto Check Digit

The check digit is automatically calculated if omitted:

```ts
import { barcode } from '@stacksjs/qrx'

// These generate the same barcode
barcode('#barcode', '590123412345', { format: 'EAN13' }) // Auto-calculates check digit
barcode('#barcode', '5901234123457', { format: 'EAN13' }) // Manual check digit
```

## Advanced Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '5901234123457', {
  format: 'EAN13',
  width: 2,
  height: 100,
  displayValue: true,
  font: 'OCRB',
  fontSize: 18,
  textMargin: 0,
  flat: false,
  lastChar: '>'
})
```

## Flat Mode

Remove guard bars for special applications:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '5901234123457', {
  format: 'EAN13',
  flat: true
})
```

[!NOTE] Image needed: EAN-13 barcode in flat mode

## Last Character

Add a character after the barcode (commonly '>')

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '5901234123457', {
  format: 'EAN13',
  lastChar: '>'
})
```

[!NOTE] Image needed: EAN-13 barcode with last character

## Add-on Support

Combine with EAN-2 or EAN-5 supplemental barcodes:

import { barcode } from '@stacksjs/qrx'

```ts
barcode('#barcode')
  .EAN13('9781234567897')
  .blank(20)
  .EAN5('12345', { height: 85, textPosition: 'top' })
  .render()
```

[!NOTE] Image needed: EAN-13 barcode with EAN-5 add-on

## Common Applications

1. Retail Products
   - Standard retail products
   - Point of sale scanning
   - Inventory management

2. Books (ISBN)
   - Prefix: 978 or 979
   - Used with EAN-5 for price

3. Periodicals (ISSN)
   - Prefix: 977
   - Used with EAN-2 for issue numbers

[!NOTE] Image needed: Real-world application examples

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '5901234123457', {
  format: 'EAN13',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid EAN-13')
      // Handle invalid input
    }
  }
})
```

## Best Practices

1. Always validate input length (12-13 digits)
2. Use OCR-B font for standard compliance
3. Ensure adequate quiet zones
4. Test scanner compatibility
5. Consider add-on requirements

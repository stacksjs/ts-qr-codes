# UPC-A

UPC-A (Universal Product Code) is the standard barcode format for retail products in North America. It consists of 12 digits and is technically a subset of EAN-13 (with a leading zero).

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789012', { format: 'UPC' })
```

[!NOTE] Image needed: Basic UPC-A barcode example

## Structure

A UPC-A barcode consists of:

- First digit: Number system digit
- Next 5 digits: Manufacturer code
- Next 5 digits: Product code
- Last digit: Check digit (automatically calculated)

## Auto Check Digit

The check digit is automatically calculated if omitted:

```ts
import { barcode } from '@stacksjs/qrx'

// These generate the same barcode
barcode('#barcode', '12345678901', { format: 'UPC' }) // Auto-calculates check digit
barcode('#barcode', '123456789012', { format: 'UPC' }) // Manual check digit
```

## Flat Mode

Remove guard bars for special applications:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789012', {
  format: 'UPC',
  flat: true
})
```

[!NOTE] Image needed: UPC-A flat mode example

## Advanced Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789012', {
  format: 'UPC',
  width: 2,
  height: 100,
  displayValue: true,
  font: 'OCRB',
  fontSize: 18,
  textMargin: 0,
  flat: false,
  guardHeight: 15 // Height of guard bars
})
```

## Guarded Encoding

The standard way of printing UPC-A with guard bars:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789012', {
  format: 'UPC',
  guardHeight: 15
})
```

[!NOTE] Image needed: Example showing guard bars

## Add-on Support

Combine with EAN-2 or EAN-5 supplemental barcodes:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode')
  .UPC('123456789012')
  .blank(20)
  .EAN5('12345', {
    height: 85,
    textPosition: 'top'
  })
  .render()
```

[!NOTE] Image needed: UPC-A with add-on example

## Number System Digits

The first digit has special meaning:

- 0: Regular UPC codes
- 1: Reserved
- 2: Weight items marked at the store
- 3: National Drug Code/Health Related
- 4: Non-food items with no code format restrictions
- 5: Coupons
- 6: Reserved
- 7: Regular UPC codes
- 8: Reserved
- 9: Reserved

```ts
// Example of a pharmaceutical product
barcode('#barcode', '312345678912', { format: 'UPC' })

// Example of a weighted item
barcode('#barcode', '212345678912', { format: 'UPC' })
```

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789012', {
  format: 'UPC',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid UPC-A')
      // Handle invalid input
    }
  }
})
```

## Best Practices

1. **Input Validation**
   - Validate length (11-12 digits)
   - Verify number system digit
   - Check manufacturer code validity

2. **Printing Guidelines**
   - Minimum size requirements
   - Quiet zone specifications
   - Print quality standards

3. **Scanner Compatibility**
   - Test with multiple scanners
   - Verify add-on compatibility
   - Check guard bar recognition

## Technical Notes

1. **Size Requirements**
   - Nominal size: 37.29mm × 25.91mm
   - Magnification range: 80% to 200%
   - Minimum bar width: 0.264mm
   - Minimum quiet zone: 9mm

2. **Conversion to EAN-13**
   ```ts
   // UPC-A
   barcode('#barcode', '123456789012', { format: 'UPC' })

   // Equivalent EAN-13
   barcode('#barcode', '0123456789012', { format: 'EAN13' })
   ```

[!NOTE] Image needed: Technical specifications diagram

## Common Applications

1. **Retail Products**
   - Consumer goods
   - Point of sale scanning
   - Inventory management

2. **Grocery Items**
   - Fixed weight products
   - Variable weight items
   - In-store marked items

3. **Healthcare Products**
   - Pharmaceuticals
   - Medical supplies
   - Health-related items

[!NOTE] Image needed: Real-world application examples

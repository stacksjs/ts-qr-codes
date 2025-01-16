# EAN-5

EAN-5 is a supplemental barcode that adds 5 additional digits to EAN-13 or UPC barcodes. It's commonly used for encoding the price of books and periodicals.

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '54495', { format: 'EAN5' })
```

[!NOTE] Image needed: Basic EAN-5 barcode example

## Structure

An EAN-5 barcode consists of:

- 5 digits total
- No check digit
- Must be used as a supplement to EAN-13 or UPC

## Common Usage with EAN-13

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode')
  .EAN13('9781234567897')
  .blank(20)
  .EAN5('54495', {
    height: 85,
    textPosition: 'top',
    fontSize: 16
  })
  .render()
```

[!NOTE] Image needed: EAN-13 with EAN-5 supplement example

## Customization Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '54495', {
  format: 'EAN5',
  width: 2,
  height: 85,
  displayValue: true,
  font: 'OCRB',
  fontSize: 16,
  textMargin: 0,
  textPosition: 'top'
})
```

## Common Applications

1. **Book Pricing**
   - Currency indicator (0-7: GBP, 8: USD, 9: AUD)
   - Price value

2. **Magazine Pricing**
   - Issue number
   - Price information

3. **Currency Encoding** Example codes:
   ```ts
   // £5.99 in GBP
   barcode('#barcode', '05991', { format: 'EAN5' })

   // $15.95 in USD
   barcode('#barcode', '81595', { format: 'EAN5' })
   ```

[!NOTE] Image needed: Currency encoding examples

## Positioning Guidelines

1. **Placement**
  - Right-aligned with main barcode
  - Standard gap between main barcode
  - Same baseline alignment

2. **Height Options**
   ```ts
   // Taller than main barcode
   barcode('#barcode', '54495', {
     format: 'EAN5',
     height: 85 // Compared to standard 70
   })
   ```

[!NOTE] Image needed: Positioning visualization

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '54495', {
  format: 'EAN5',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid EAN-5')
      // Handle invalid input
    }
  }
})
```

## Best Practices

1. Always use with main barcode
2. Maintain proper spacing
3. Consider height differential
4. Validate 5-digit input
5. Use standard encoding for currency

## Technical Notes

- No check digit used
- Must be 5 digits exactly
- Cannot be used standalone
- Scanner must support add-ons
- Standard right-alignment required

[!NOTE] Image needed: Technical specifications diagram

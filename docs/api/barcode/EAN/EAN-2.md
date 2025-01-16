# EAN-2

EAN-2 is a supplemental two-digit barcode typically used for periodical publications to indicate issue numbers. It's the smallest of the EAN supplemental barcodes and must be used in conjunction with EAN-13, EAN-8, or UPC barcodes.

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '53', { format: 'EAN2' })
```

[!NOTE] Image needed: Basic EAN-2 barcode example

## Structure

An EAN-2 barcode consists of:

- Exactly 2 digits
- No check digit
- Must be used as a supplement
- Values from 00-99

## Usage with Main Barcode

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode')
  .EAN13('9771234567003')
  .blank(20)
  .EAN2('53', {
    height: 85,
    textPosition: 'top',
    fontSize: 16
  })
  .render()
```

[!NOTE] Image needed: EAN-13 with EAN-2 add-on example

## Customization Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '53', {
  format: 'EAN2',
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

1. Magazine Issues
   ```ts
   // Issue 12 of a magazine
   barcode('#barcode', '12', { format: 'EAN2' })
   ```

2. Newspaper Editions
   ```ts
   // Sunday edition (01)
   barcode('#barcode', '01', { format: 'EAN2' })
   ```

3. Version Indicators
   ```ts
   // Version 2.0
   barcode('#barcode', '20', { format: 'EAN2' })
   ```

[!NOTE] Image needed: Real-world application examples

## Positioning Guidelines

1. Standard Placement
   - Right-aligned with main barcode
   - Specific gap width (9-12 modules)
   - Baseline alignment with main barcode

2. Height Considerations
   ```ts
   // Typically taller than main barcode
   barcode('#barcode', '53', {
     format: 'EAN2',
     height: 85 // Compared to standard 70
   })
   ```

[!NOTE] Image needed: Positioning and alignment diagram

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '53', {
  format: 'EAN2',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid EAN-2')
      // Handle invalid input
    }
  }
})
```

## Best Practices

1. Usage Guidelines
   - Always use with main barcode
   - Maintain standard spacing
   - Use consistent height ratio
   - Validate 2-digit input
   - Consider scanner compatibility

2. Common Patterns
   - 00-09: _Daily publications_
   - 10-99: _Weekly/monthly publications_

## Technical Notes

- No check digit mechanism
- Must be exactly 2 digits
- Cannot be used standalone
- Scanner must support add-ons
- Standard right-alignment required
- Smaller than EAN-5 supplement

## Migration Considerations

If you need more capacity, consider using EAN-5 instead:

```ts
// EAN-2 version
barcode('#barcode')
  .EAN13('9771234567003')
  .blank(20)
  .EAN2('53')
  .render()

// EAN-5 equivalent
barcode('#barcode')
  .EAN13('9771234567003')
  .blank(20)
  .EAN5('00053')
  .render()
```

[!NOTE] Image needed: Comparison between EAN-2 and EAN-5 supplements

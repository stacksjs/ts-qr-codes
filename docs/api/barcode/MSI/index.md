# MSI Barcode

MSI _(Modified Plessey)_ is a specialized barcode format developed by the MSI Data Corporation. It's primarily used for inventory control, warehouse management, and retail shelf marking. The format supports numeric digits (0-9) and includes various checksum options for error detection.

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789', {
  format: 'MSI'
})
```

![MSI Barcode](http://i.imgur.com/cm4ZQpE.png)

## Available Variants

qrx supports multiple MSI variants with different checksum calculations:

```ts
// Basic MSI (no checksum)
barcode('#barcode', '1234', { format: 'MSI' }) // Result: 1234

// With Mod 10 checksum
barcode('#barcode', '1234', { format: 'MSI10' }) // Result: 12344

// With Mod 11 checksum
barcode('#barcode', '1234', { format: 'MSI11' }) // Result: 12343

// With double Mod 10 checksum
barcode('#barcode', '1234', { format: 'MSI1010' }) // Result: 123448

// With Mod 11 & Mod 10 checksum
barcode('#barcode', '1234', { format: 'MSI1110' }) // Result: 123430
```

[!NOTE] Image needed: Visual comparison of different MSI variants

## Customization Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789', {
  format: 'MSI',
  width: 2,
  height: 100,
  displayValue: true,
  fontSize: 20,
  font: 'monospace',
  textAlign: 'center',
  textPosition: 'bottom',
  textMargin: 2,
  background: '#ffffff',
  lineColor: '#000000'
})
```

## Common Applications

1. **Retail**
   - Shelf marking
   - Price labels
   - Inventory tags

2. **Warehouse**
   - Location marking
   - Bin labels
   - Storage containers

3. **Inventory Control**
   - Asset tracking
   - Stock management
   - Item identification

[!NOTE] Image needed: Real-world application examples

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '123456789', {
  format: 'MSI',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid MSI barcode input')
      // Handle invalid input
    }
  }
})
```

## Technical Specifications

1. **Character Set**
   - Numeric only (0-9)
   - Variable length
   - Optional checksums

2. **Structure**
   - Start character
   - Data digits
   - Optional check digit(s)
   - Stop character

3. **Variants Available**
   - [MSI10](./MSI10) - Single Mod 10
   - [MSI11](./MSI11) - Single Mod 11
   - [MSI1010](./MSI1010) - Double Mod 10
   - [MSI1110](./MSI1110) - Mod 11 & Mod 10

## Best Practices

1. **Checksum Selection**
   - Use MSI10 for basic error detection
   - Use MSI1010 for enhanced reliability
   - Use MSI1110 for maximum security

2. **Implementation Guidelines**
   - Validate numeric input
   - Consider scanner compatibility
   - Test checksum verification

3. **Print Quality**
   - Maintain quiet zones
   - Ensure adequate contrast
   - Verify scanner readability

[!NOTE] Image needed: Best practices visualization

## Migration Guide

If transitioning from MSI to modern formats:

```ts
// Current MSI implementation
barcode('#barcode', '123456789', { format: 'MSI' })

// Modern alternative (CODE128)
barcode('#barcode', '123456789', { format: 'CODE128' })
```

For detailed information about specific MSI variants, see:

- [MSI10 Documentation](./MSI10.md)
- [MSI11 Documentation](./MSI11.md)
- [MSI1010 Documentation](./MSI1010.md)
- [MSI1110 Documentation](./MSI1110.md)

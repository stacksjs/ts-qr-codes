# MSI10 (Mod 10)

MSI10 is the MSI variant that uses a single Mod 10 check digit for error detection. This is the most common MSI variant, providing basic error detection while maintaining simplicity.

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234', { format: 'MSI10' }) // Result: 12344
```

[!NOTE] Image needed: Basic MSI10 barcode example

## Mod 10 Checksum Calculation

The Mod 10 checksum is calculated as follows:
1. Multiply alternate digits by 2, starting from the right
2. Sum the individual digits of the products
3. Add the remaining numbers
4. The check digit is the number needed to make sum divisible by 10

Example:
```
Data: 1234
Step 1: 1 2 3 4 → (1)(2×2)(3)(4×2)
Step 2: 1 4 3 8
Step 3: 1 + 4 + 3 + 8 = 16
Step 4: Check digit = 4 (to make 16 + 4 = 20)
Result: 12344
```

## Advanced Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234', {
  format: 'MSI10',
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

## Error Detection

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234', {
  format: 'MSI10',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid MSI10 input')
      // Handle invalid input
    }
  }
})
```

## Common Applications

1. **Retail Inventory**
   - Shelf labels
   - Price tags
   - Basic inventory control

2. **Simple Asset Tracking**
   - Basic equipment labeling
   - Location marking
   - Container identification

[!NOTE] Image needed: Real-world application examples

## Best Practices

1. **Input Validation**
   - Verify numeric-only input
   - Check maximum length
   - Validate check digit

2. **Implementation**
   - Test scanner compatibility
   - Verify checksum calculation
   - Maintain adequate quiet zones

3. **When to Use MSI10**
   - Basic inventory tracking
   - Simple shelf marking
   - When single check digit is sufficient

## Comparison with Other MSI Variants

| Feature | MSI10 | MSI11 | MSI1010 | MSI1110 |
|---------|-------|-------|---------|----------|
| Check Digits | 1 | 1 | 2 | 2 |
| Algorithm | Mod 10 | Mod 11 | Mod 10×2 | Mod 11+10 |
| Error Detection | Basic | Good | Better | Best |
| Data Length | Shorter | Shorter | Longer | Longer |

[!NOTE] Image needed: Visual comparison of variants

## Upgrade Path

If you need better error detection, consider upgrading to:
```ts
// Current MSI10
barcode('#barcode', '1234', { format: 'MSI10' })

// Upgrade to MSI1010 for double check digit
barcode('#barcode', '1234', { format: 'MSI1010' })

// Upgrade to MSI1110 for maximum security
barcode('#barcode', '1234', { format: 'MSI1110' })
```

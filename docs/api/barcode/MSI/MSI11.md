# MSI11 (Mod 11)

MSI11 is the MSI variant that uses a single Mod 11 check digit for error detection. It provides stronger error detection than MSI10 by using a different checksum algorithm.

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234', { format: 'MSI11' }) // Result: 12343
```

[!NOTE] Image needed: Basic MSI11 barcode example

## Mod 11 Checksum Calculation

The Mod 11 checksum uses a weighted system:

1. Assign weights (2,3,4,5,6,7) to digits from right to left, repeating if needed
2. Multiply each digit by its weight and sum results
3. Calculate Mod 11 of the sum
4. Subtract from 11 to get check digit (if 11, use 0; if 10, use 1)

Example:

```
Data: 1234
Weights: 5,4,3,2 (right to left)
Step 1: (1×5) + (2×4) + (3×3) + (4×2) = 5 + 8 + 9 + 8 = 30
Step 2: 30 mod 11 = 8
Step 3: 11 - 8 = 3
Result: 12343
```

## Advanced Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234', {
  format: 'MSI11',
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
  format: 'MSI11',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid MSI11 input')
      // Handle invalid input
    }
  }
})
```

## Common Applications

1. **Industrial Control**
   - Manufacturing tracking
   - Quality control labeling
   - Process control

2. **Warehouse Management**
   - High-accuracy inventory
   - Critical item tracking
   - Location verification

[!NOTE] Image needed: Real-world application examples

## Best Practices

1. **Input Validation**
   - Verify numeric-only input
   - Check maximum length
   - Validate Mod 11 check digit

2. **Implementation**
   - Test scanner compatibility
   - Verify checksum calculation
   - Maintain adequate quiet zones

3. **When to Use MSI11**
   - Higher security needs than MSI10
   - Critical inventory tracking
   - When error detection is important

## Comparison with Other MSI Variants

| Feature | MSI11 | MSI10 | MSI1010 | MSI1110 |
|---------|-------|-------|---------|----------|
| Check Digits | 1 | 1 | 2 | 2 |
| Algorithm | Mod 11 | Mod 10 | Mod 10×2 | Mod 11+10 |
| Error Detection | Better | Basic | Better | Best |
| Data Length | Shorter | Shorter | Longer | Longer |

[!NOTE] Image needed: Visual comparison of variants

## Error Types Detected

MSI11 can detect:

- Single digit errors (100%)
- Transposition errors (100%)
- Most double digit errors
- Many random errors

## Migration Options

If different error detection is needed:

```ts
// Current MSI11
barcode('#barcode', '1234', { format: 'MSI11' })

// Switch to MSI10 for simpler validation
barcode('#barcode', '1234', { format: 'MSI10' })

// Upgrade to MSI1110 for maximum security
barcode('#barcode', '1234', { format: 'MSI1110' })
```

## Technical Notes

1. **Check Digit Range**
   - Values 0-9 (10 becomes 1, 11 becomes 0)
   - Non-sequential relationship to data
   - Weighted calculation method

2. **Scanner Compatibility**
   - Verify scanner supports Mod 11
   - Check configuration requirements
   - Test with actual hardware

3. **Error Detection Strength**
   - Better than MSI10 for single errors
   - Strong against transpositions
   - Good for critical applications

[!NOTE] Image needed: Technical diagram showing check digit calculation

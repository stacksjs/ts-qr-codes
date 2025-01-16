# Codabar

Codabar _(also known as Code 2 of 7, USD-4, or NW-7)_ is a linear barcode format developed in 1972. While considered legacy technology, it's still commonly used in libraries, blood banks, and some logistics applications. It can encode numbers and specific special characters (`–`, `$`, `:`, `/`, `+`, `.`).

## Basic Usage

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '1234567890', {
  format: 'codabar'
})
```

![CodabarBarcode](http://i.imgur.com/nzAVIl3.png)

## Start/Stop Characters

You can specify start and stop characters (`A`, `B`, `C`, or `D`). If not specified, `A` is used by default:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', 'C1234567890D', {
  format: 'codabar'
})
```

![CodabarBarcode](http://i.imgur.com/TEdMAqp.png)

## Character Set

Codabar supports:
- Numbers (0-9)
- Special characters: `-`, `$`, `:`, `/`, `+`, `.`
- Start/Stop characters: `A`, `B`, `C`, `D`

## Advanced Options

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', 'A1234-5678.90B', {
  format: 'codabar',
  width: 2,
  height: 100,
  displayValue: true,
  font: 'monospace',
  fontSize: 20,
  textAlign: 'center',
  textPosition: 'bottom',
  textMargin: 2,
  background: '#ffffff',
  lineColor: '#000000'
})
```

[!NOTE] Image needed: Advanced options example

## Common Applications

1. **Blood Banks**
   ```ts
   barcode('#barcode', 'A1234567B', { format: 'codabar' }) // Blood type labeling
   ```

2. **Libraries**
   ```ts
   barcode('#barcode', 'A123-456+789B', { format: 'codabar' }) // Book tracking
   ```

3. **Photo Labs**
   ```ts
   barcode('#barcode', 'C12345/678D', { format: 'codabar' }) // Photo processing
   ```

[!NOTE] Image needed: Real-world application examples

## Error Handling

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', 'A123456B', {
  format: 'codabar',
  valid: (valid) => {
    if (!valid) {
      console.error('Invalid Codabar')
      // Handle invalid input
    }
  }
})
```

## Best Practices

1. **Start/Stop Characters**
   - Always use matching pairs (AA, BB, CC, DD)
   - Be consistent across system
   - Consider scanner configuration

2. **Data Validation**
   ```ts
   // Valid examples
   barcode('#barcode', 'A1234-5678B') // Numbers and hyphen
   barcode('#barcode', 'C1234:5678D') // Numbers and colon
   barcode('#barcode', 'A12.34+56/78A') // Multiple special chars
   ```

3. **Print Quality**
   - Maintain adequate quiet zones
   - Test with target scanners
   - Verify contrast ratios

## Technical Specifications

- Variable length format
- Self-checking capability
- No check digit (but can be added)
- Bi-directional reading
- Wide/narrow bar ratio: 1:2.25 to 1:3

[!NOTE] Image needed: Technical specifications diagram

## Legacy System Integration

```ts
// Old system format
barcode('#barcode', 'A1234B')

// Modern alternative (Code 128)
barcode('#barcode', '1234', { format: 'CODE128' })
```

[!NOTE] Image needed: Comparison with modern formats

## Advantages & Limitations

### Advantages

- Simple structure
- Self-checking
- Bi-directional reading
- Special character support
- Wide hardware support

### Limitations

- Low data density
- No built-in check digit
- Limited character set
- Older technology

[!NOTE] Image needed: Advantages/limitations comparison chart

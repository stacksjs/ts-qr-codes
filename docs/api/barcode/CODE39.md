# CODE39

CODE39 (also known as Code 3 of 9) is one of the earliest barcode formats still in use today. While CODE128 is generally recommended for new implementations, CODE39 remains widely used in inventory management, military applications, and automotive industries due to its simplicity and legacy support.

## Character Set

CODE39 supports:

- Numbers (0-9)
- Uppercase letters (A-Z)
- Special characters: `-`, `.`, `$`, `/`, `+`, `%`, `space`
- Start/Stop characters (`*`) are automatically added

## Basic Usage

Here's a simple example of generating a CODE39 barcode:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', 'CODE39 Barcode', {
  format: 'CODE39'
})
```

[!NOTE] Image needed: Result of the above basic example showing the generated barcode

## Checksum Support (Mod43)

CODE39 supports an optional modulo 43 checksum digit for enhanced error detection. When enabled:

1. A check digit is calculated using modulo 43 algorithm
2. The check digit is appended to the data
3. Barcode scanners must be configured to validate mod43

Enable the checksum using the `mod43` option:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', 'ABCDEFG', {
  format: 'CODE39',
  mod43: true
})
```

[!NOTE] Image needed: Result of the above example showing the generated barcode with checksum digit

## Customization Options

CODE39 supports all standard customization options:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', 'CUSTOM39', {
  format: 'CODE39',
  width: 2, // Bar width
  height: 100, // Barcode height
  displayValue: true, // Show text below barcode
  fontSize: 20, // Text size
  font: 'monospace', // Text font
  textAlign: 'center', // Text alignment
  textPosition: 'bottom', // Text position
  background: '#ffffff', // Background color
  lineColor: '#ffffff' // Bar color
})
```

## Technical Specifications

- Type: Discrete, variable-length
- Character Set: 43 characters (0-9, A-Z, and 7 special characters)
- Check Digit: Optional (Mod 43)
- Self-Checking: Yes
- Length: Variable
- Error Detection: Basic (improved with Mod 43)

[!NOTE] Image needed: Diagram showing CODE39 barcode structure

## Common Use Cases

1. **Military/Government**
   - CAGE (Commercial and Government Entity) codes
   - Department of Defense applications

2. **Automotive Industry**
   - Vehicle Identification Numbers (VIN)
   - Part tracking

3. **Healthcare**
   - Patient identification
   - Medical equipment tracking

[!NOTE] Image needed: Example of CODE39 in real-world application

## Advantages and Limitations

### Advantages

- Simple structure
- Self-checking
- Widely supported
- No special start/stop characters needed
- Readable even if printed at low density

### Limitations

- Lower data density than CODE128
- Limited character set
- Larger space requirement
- No native support for lowercase letters

## Best Practices

1. Input Validation
   - Always verify input contains only valid characters
   - Consider using uppercase transformation for input

2. Error Handling
   ```ts
   try {
     barcode('#barcode', 'TEST-123', { format: 'CODE39' })
   }
   catch (error) {
     console.error('Barcode generation failed:', error)
   }
   ```

3. Check Digit Usage
   - Enable mod43 for applications requiring high reliability
   - Ensure scanners are configured correctly for mod43

## Migration to CODE128

If you're considering migrating from CODE39 to CODE128:

```ts
// Old CODE39 implementation
barcode('#barcode', 'LEGACY-123', { format: 'CODE39' })

// New CODE128 equivalent
barcode('#barcode', 'LEGACY-123', { format: 'CODE128' })
```

[!NOTE] Image needed: Side-by-side comparison of CODE39 vs CODE128

For more information about ASCII characters and their codes, see the ASCII Table.

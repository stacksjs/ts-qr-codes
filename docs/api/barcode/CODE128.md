# CODE128

CODE128 is one of the most versatile barcode formats available. It has full support for all 128 ASCII characters while maintaining efficient number encoding. The format features three modes (A/B/C) and can dynamically switch between them, making it highly adaptable for various use cases. CODE128 is the default format in qrx when no specific format is specified.

## Understanding CODE128 Modes

CODE128 has three different modes, each optimized for different types of data:

- **Mode A**: Uppercase letters, numbers, and special characters
- **Mode B**: Upper and lowercase letters, numbers, and special characters
- **Mode C**: Numbers only (encoded in pairs for maximum density)

[!NOTE] Image needed: Visual comparison of the same data encoded in different modes (A, B, and C)

## Basic Usage

The simplest way to use CODE128 is to let qrx automatically choose the best mode:

```ts
import { barcode } from '@stacksjs/qrx'

// Automatic mode (recommended)
barcode('#barcode', 'Example1234') // CODE128 auto is the default
barcode('#barcode', 'Example1234', { format: 'CODE128' }) // Explicit format specification
```

[!NOTE] Image needed: Result of the above basic examples showing the generated barcodes

## Force Modes

Sometimes you may need to force a specific CODE128 mode, particularly when working with barcode scanners that only support certain modes:

```ts
import { barcode } from '@stacksjs/qrx'

// Mode A - Uppercase & Control Characters
barcode('#barcode', 'EXAMPLE\n1234', { format: 'CODE128A' })

// Mode B - All ASCII Characters
barcode('#barcode', 'Example1234', { format: 'CODE128B' })

// Mode C - Numbers Only (most compact)
barcode('#barcode', '12345678', { format: 'CODE128C' })
```

[!NOTE] Image needed: Side-by-side comparison of the same data encoded in each mode

## GS1-128/EAN-128 Support

CODE128 can be encoded as GS1-128 _(formerly known as EAN-128)_ using the `ean128` option:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', '12345678', {
  format: 'CODE128C',
  ean128: true
})
```

[!NOTE] Image needed: Comparison of normal CODE128 vs GS1-128 encoding

## Working with Special Characters

CODE128 supports the full ASCII character set (0-127). Here are different ways to encode special characters:

```ts
import { barcode } from '@stacksjs/qrx'

// Using escape sequences
barcode('#barcode', '\n\t\r')

// Using hex codes
barcode('#barcode', '\x0A\x09\x0D')

// Using ASCII values
barcode('#barcode', String.fromCharCode(10, 9, 13))
```

[!NOTE] Image needed: Examples of barcodes with special characters encoded

## Advanced Options

You can customize the appearance of CODE128 barcodes with these options:

```ts
import { barcode } from '@stacksjs/qrx'

barcode('#barcode', 'Example1234', {
  format: 'CODE128',
  width: 2, // Width of a single bar
  height: 100, // Height of the barcode
  displayValue: true, // Show the text below the barcode
  fontSize: 20, // Size of the text
  font: 'monospace', // Font family
  textAlign: 'center', // Text alignment (left/center/right)
  textPosition: 'bottom', // Text position (top/bottom)
  background: '#ffffff', // Background color
  lineColor: '#000000', // Barcode color
})
```

[!NOTE] Image needed: Examples showing different customization options

## Best Practices

1. Mode Selection:
   - Use automatic mode unless you have specific requirements
   - Use Mode C for number-only data for maximum density
   - Use Mode A when uppercase and control characters are needed
   - Use Mode B for mixed-case text

2. Data Validation:
   ```ts
   barcode('#barcode', 'Your Data', {
     format: 'CODE128',
     valid: (valid) => {
       if (!valid)
         console.error('Invalid data for CODE128')
     }
   })
   ```

3. Error Handling:
   ```ts
   try {
     barcode('#barcode', 'Your Data', { format: 'CODE128' })
   }
   catch (error) {
     console.error('Failed to generate barcode:', error)
   }
   ```

## Format Specifications

- **Character Set:** Full ASCII (0-127)
- **Data Length:** Variable
- **Check Digit:** Modulo 103
- **Start/Stop Characters:** Automatically added
- **Error Detection:** Built-in check character

[!NOTE] Image needed: Diagram showing the structure of a CODE128 barcode

For information about ASCII characters and their codes, see the ASCII Table.

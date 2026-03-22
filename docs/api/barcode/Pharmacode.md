# Pharmacode

Pharmacode is a barcode used in the pharmaceutical industry. It can encode numbers 3 to 131070.

## Example

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', '1234', {
  format: 'pharmacode',
  width: 4,
  height: 40,
  displayValue: false
})
```

![Pharmacode](http://i.imgur.com/j6XZOoL.png)

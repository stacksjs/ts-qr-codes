# ITF-14

ITF-14 (Interleaved Two of Five) is the GS1 implementation of an Interleaved 2 of 5 bar code to encode a Global Trade Item Number. ITF-14 symbols are generally used on packaging levels of a product, such as a case box of 24 cans of soup. The ITF-14 will always encode 14 digits.

The last digit of an ITF-14 barcode is an checksum. It is normally included but qrx can automatically calculate it for you if it is left out.

## Example

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', '12345678901231', {
  format: 'ITF14'
})
```

![ITF-14 Barcode](http://i.imgur.com/GqbdWrg.png)

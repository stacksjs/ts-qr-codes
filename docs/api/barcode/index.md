# All Options

::: info
Thank you to all `JsBarcode` contributors for their work. And, in particular, many thanks to [lindell](https://lindell.me/) for the groundwork!
:::

| Option | Default value | Type |
|--------|---------------|------|
| [`format`](https://ts-quick-reaction.netlify.app/barcode/options#format) | `"auto" (CODE128)` | `String` |
| [`width`](https://ts-quick-reaction.netlify.app/barcode/options#width) | `2` | `Number` |
| [`height`](https://ts-quick-reaction.netlify.app/barcode/options#height) | `100` | `Number` |
| [`displayValue`](https://ts-quick-reaction.netlify.app/barcode/options#display-value) | `true` | `Boolean` |
| [`text`](https://ts-quick-reaction.netlify.app/barcode/options#text) | `undefined` | `String` |
| [`fontOptions`](https://ts-quick-reaction.netlify.app/barcode/options#font-options) | `""` | `String` |
| [`font`](https://ts-quick-reaction.netlify.app/barcode/options#font) | `"monospace"` | `String` |
| [`textAlign`](https://ts-quick-reaction.netlify.app/barcode/options#text-align) | `"center"` | `String` |
| [`textPosition`](https://ts-quick-reaction.netlify.app/barcode/options#text-position) | `"bottom"` | `String` |
| [`textMargin`](https://ts-quick-reaction.netlify.app/barcode/options#text-margin) | `2` | `Number` |
| [`fontSize`](https://ts-quick-reaction.netlify.app/barcode/options#font-size) | `20` | `Number` |
| [`background`](https://ts-quick-reaction.netlify.app/barcode/options#background)  | `"#ffffff"` | `String (CSS color)` |
| [`lineColor`](https://ts-quick-reaction.netlify.app/barcode/options#line-color) | `"#000000"` | `String (CSS color)` |
| [`margin`](https://ts-quick-reaction.netlify.app/barcode/options#margins) | `10` | `Number` |
| [`marginTop`](https://ts-quick-reaction.netlify.app/barcode/options#margins) | `undefined` | `Number` |
| [`marginBottom`](https://ts-quick-reaction.netlify.app/barcode/options#margins) | `undefined` | `Number` |
| [`marginLeft`](https://ts-quick-reaction.netlify.app/barcode/options#margins) | `undefined` | `Number` |
| [`marginRight`](https://ts-quick-reaction.netlify.app/barcode/options#margins) | `undefined` | `Number` |
| [`flat`](https://ts-quick-reaction.netlify.app/barcode/options#flat) | `false` | `Boolean` |
| [`valid`](https://ts-quick-reaction.netlify.app/barcode/options#valid) | `function(valid){}` | `Function` |

## Format

****default: "auto" (CODE128)****

Select which [barcode type](https://ts-quick-reaction.netlify.app/barcodes) to use. Please check the documentation of the specific barcode type for more information.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', '123456789012', {
  format: 'EAN13'
})

barcode('#barcode', '123456789012', {
  format: 'CODE39'
})
```

***Result***

![EAN13](https://i.imgur.com/XQ9taWU.png)
![CODE39](https://i.imgur.com/3dbwAnN.png)

## Width

****default: 2****

The width option is the width of a single bar.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Smallest width', {
  width: 1
})

barcode('#barcode', 'Wider barcode', {
  width: 3
})
```

***Result***

![Smallest width](https://i.imgur.com/cdZ0V0e.png)
![Wider barcode](https://i.imgur.com/AcyECCt.png)

## Height

***default: 100***

The height of the barcode.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Tall barcode', {
  height: 150
})

barcode('#barcode', 'Short barcode', {
  height: 25
})
```

***Result***

![Tall barcode](https://i.imgur.com/9ZGfSQb.png)
![Short barcode](https://i.imgur.com/pZKzWWu.png)

## Text

***default: undefined***

Override the text that is displayed

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Hello', {
  text: 'Hi!'
})
```

***Result***

![Text example](https://i.imgur.com/2mHpHt9.png)

## Font Options

***default: ""***

With `fontOptions` you can add bold or italic text to the barcode.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Bold text', {
  fontOptions: 'bold'
})

barcode('#barcode', 'Italic text', {
  fontOptions: 'italic'
})

barcode('#barcode', 'Both options', {
  fontOptions: 'bold italic'
})
```

***Result***

![Bold text](https://i.imgur.com/JoVVLsV.png)
![Italic text](https://i.imgur.com/No2tfot.png)
![Both options](https://i.imgur.com/lVFKttQ.png)

## Font

***default: "monospace"***

Define the font used for the text in the generated barcode. This can be any default font or a font defined by a [@font-face](https://developer.mozilla.org/en/docs/Web/CSS/@font-face) rule.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Fantasy font', {
  font: 'fantasy'
})
```

***Result***

![Fantasy font](https://i.imgur.com/s8mpWMT.png)

## Text Align

***default: "center"***

Set the horizontal alignment of the text. Can be left / center / right.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Left text', {
  textAlign: 'left'
})
```

***Result***

![Left text](https://i.imgur.com/t4E1FtJ.png)

## Text Position

***default: "bottom"***

Set the vertical position of the text. Can be bottom / top.

***Examples***

```ts
barcode('#barcode', 'Top text', {
  textPosition: 'top'
})
```

***Result***

![Top text](https://i.imgur.com/AkcbbXV.png)

## Text Margin

***default: 2***

Set the space between the barcode and the text.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Text margin', {
  textMargin: 25
})
```

***Result***

![Text margin](https://i.imgur.com/VsamEOy.png)

## Font Size

***default: 20***

Set the size of the text.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Bigger text', {
  fontSize: 40
})
```

***Result***

![Bigger text](https://i.imgur.com/QAghLVa.png)

## Background

***default: "#ffffff"***

Set the background of the barcode.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Blue background', {
  background: '#ccffff'
})
```

***Result***

![Blue background](https://i.imgur.com/mpkuZ7r.png)

## Line Color

***default: "#000000"***

Set the color of the bars and the text.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Red lines', {
  lineColor: '#990000'
})
```

***Result***

![Red lines](https://i.imgur.com/fJtMC6p.png)

## Margins

***default: 10***

Set the space margin around the barcode. If nothing else is set, all side will inherit the margins property but can be replaced if you want to set them separably.

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', 'Bigger margins', {
  margin: 30,
  background: '#dddddd'
})

barcode('#barcode', 'Left/Top margin', {
  marginLeft: 30,
  marginTop: 50,
  background: '#dddddd'
})
```

***Result***

![Bigger margins](https://i.imgur.com/ahToYOQ.png)
![Left/Top margin](https://i.imgur.com/aIYlKy8.png)

## Flat

***default: false***

Only for EAN8/EAN13

***Examples***

```ts
import { barcode } from 'ts-qr-codes'

barcode('#barcode', '29012343', {
  format: 'EAN8',
  flat: false
})

barcode('#barcode', '29012343', {
  format: 'EAN8',
  flat: true
})
```

***Result***

![Flat/Non-Flat](https://i.stack.imgur.com/aXLUv.jpg)

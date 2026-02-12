import type { BarcodeOptions } from '@stacksjs/qrx'
import { barcode } from '@stacksjs/qrx'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface BarcodeProps {
  value: string | number
  format?: string
  width?: string | number
  height?: string | number
  displayValue?: string | boolean
  text?: string | number
  fontOptions?: string
  font?: string
  textAlign?: string
  textPosition?: string
  textMargin?: string | number
  fontSize?: string | number
  background?: string
  lineColor?: string
  margin?: string | number
  marginTop?: string | number
  marginBottom?: string | number
  marginLeft?: string | number
  marginRight?: string | number
  flat?: boolean
  ean128?: string | boolean
  elementTag?: 'svg' | 'canvas' | 'img'
  onValid?: (valid: boolean) => void
  children?: React.ReactNode
}

export function Barcode({
  value,
  format,
  width,
  height,
  displayValue = true,
  text,
  fontOptions,
  font,
  textAlign,
  textPosition,
  textMargin,
  fontSize,
  background,
  lineColor,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  flat,
  ean128,
  elementTag = 'svg',
  onValid,
  children,
}: BarcodeProps): React.JSX.Element {
  const elementRef = useRef<HTMLElement>(null)
  const [valid, setValid] = useState(true)

  const renderBarcode = useCallback(() => {
    const el = elementRef.current
    if (!el)
      return

    const settings: BarcodeOptions = {
      format,
      width,
      height,
      displayValue,
      text,
      fontOptions,
      font,
      textAlign,
      textPosition,
      textMargin,
      fontSize,
      background,
      lineColor,
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      flat,
      ean128,
      elementTag,
      valid: (v: boolean) => {
        setValid(v)
        onValid?.(v)
      },
    }

    // Remove undefined props so the barcode lib uses its defaults
    for (const key of Object.keys(settings) as Array<keyof BarcodeOptions>) {
      if (settings[key] === undefined)
        delete settings[key]
    }

    try {
      barcode(el, String(value), settings)
    }
    catch {
      setValid(false)
      onValid?.(false)
    }
  }, [
    value, format, width, height, displayValue, text, fontOptions, font,
    textAlign, textPosition, textMargin, fontSize, background, lineColor,
    margin, marginTop, marginBottom, marginLeft, marginRight, flat, ean128,
    elementTag, onValid,
  ])

  useEffect(() => {
    renderBarcode()
  }, [renderBarcode])

  const Element = elementTag

  return (
    <div>
      <Element
        ref={elementRef as any}
        className="react-barcode-element"
        style={{ display: valid ? undefined : 'none' }}
      />
      {!valid && children && (
        <div>{children}</div>
      )}
    </div>
  )
}

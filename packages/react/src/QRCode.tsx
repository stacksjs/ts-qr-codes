import type { QRCodeOptions } from '@stacksjs/qrx'
import { QRCode as QRCodeGenerator, QRErrorCorrectLevel } from '@stacksjs/qrx'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface QRCodeProps {
  value: string
  width?: number
  height?: number
  colorDark?: string
  colorLight?: string
  correctLevel?: QRErrorCorrectLevel
  useSVG?: boolean
  children?: React.ReactNode
}

export function QRCode({
  value,
  width = 256,
  height = 256,
  colorDark = '#000000',
  colorLight = '#ffffff',
  correctLevel = QRErrorCorrectLevel.M,
  useSVG = false,
  children,
}: QRCodeProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const [valid, setValid] = useState(true)

  const renderQRCode = useCallback(() => {
    const el = containerRef.current
    if (!el)
      return

    // Clear previous render
    el.innerHTML = ''

    const options: QRCodeOptions = {
      text: value,
      width,
      height,
      colorDark,
      colorLight,
      correctLevel,
      useSVG,
    }

    try {
      new QRCodeGenerator(el, options)
      setValid(true)
    }
    catch {
      setValid(false)
    }
  }, [value, width, height, colorDark, colorLight, correctLevel, useSVG])

  useEffect(() => {
    renderQRCode()
  }, [renderQRCode])

  return (
    <div>
      <div
        ref={containerRef}
        className="react-qrcode-element"
        style={{ display: valid ? undefined : 'none' }}
      />
      {!valid && children && (
        <div>{children}</div>
      )}
    </div>
  )
}

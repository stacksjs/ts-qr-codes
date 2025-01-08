export interface QrxConfig {
  type: 'bar' | 'qr'
  options: BarcodeConfig | QRCodeConfig
}

export interface QrxOptions {
  type?: 'bar' | 'qr'
  options?: BarcodeOptions | QRCodeOptions
}

export interface BarcodeSettings {
  format: string
  width: string | number
  height: string | number
  displayValue: string | boolean
  text: string | number
  fontOptions: string
  font: string
  textAlign: string
  textPosition: string
  textMargin: string | number
  fontSize: string | number
  background: string
  lineColor: string
  margin: string | number
  marginTop: string | number | undefined
  marginBottom: string | number | undefined
  marginLeft: string | number | undefined
  marginRight: string | number | undefined
  flat: boolean
  ean128: string | boolean
  elementTag: string
  valid: (valid: boolean) => void
}

export type BarcodeOptions = Partial<BarcodeSettings>

interface NodeConfig extends BarcodeSettings {
  xmlDocument?: XMLDocument
}

export interface NodeOptions extends BarcodeOptions {
  xmlDocument?: XMLDocument
}

interface Code128Config extends BarcodeSettings {
  ean128: boolean
}

interface Code128Options extends BarcodeOptions {
  ean128?: boolean
}

export interface Ean8Config extends BarcodeSettings {
  flat: boolean
}

interface Ean8Options extends BarcodeOptions {
  flat?: boolean
}

interface Ean13Config extends BarcodeOptions {
  flat: boolean
  lastChar: string
}

interface Ean13Options extends BarcodeOptions {
  flat?: boolean
  lastChar?: string
}

export type BarcodeConfig = BarcodeSettings | Code128Config | Ean13Config | NodeConfig

export interface Barcode {
  options: (options: BarcodeConfig) => Barcode
  blank: (size: number) => Barcode
  init: (options?: BarcodeConfig) => void
  render: () => void
  CODE39: (value: string, options?: BarcodeConfig) => Barcode
  CODE128: (value: string, options?: Code128Options) => Barcode
  CODE128A: (value: string, options?: Code128Options) => Barcode
  CODE128B: (value: string, options?: Code128Options) => Barcode
  CODE128C: (value: string, options?: Code128Options) => Barcode
  EAN13: (value: string, options?: Ean13Options) => Barcode
  EAN8: (value: string, options?: Ean8Options) => Barcode
  EAN5: (value: string, options?: BarcodeConfig) => Barcode
  EAN2: (value: string, options?: BarcodeConfig) => Barcode
  UPC: (value: string, options?: BarcodeConfig) => Barcode
  ITF14: (value: string, options?: BarcodeConfig) => Barcode
  ITF: (value: string, options?: BarcodeConfig) => Barcode
  MSI: (value: string, options?: BarcodeConfig) => Barcode
  MSI10: (value: string, options?: BarcodeConfig) => Barcode
  MSI11: (value: string, options?: BarcodeConfig) => Barcode
  MSI1010: (value: string, options?: BarcodeConfig) => Barcode
  MSI1110: (value: string, options?: BarcodeConfig) => Barcode
  Pharmacode: (value: string, options?: BarcodeConfig) => Barcode
  Codabar: (value: string, options?: BarcodeConfig) => Barcode
}

/**
 * Enumeration of QR modes.
 */
export enum QRMode {
  MODE_NUMBER = 1, // 1 << 0 is equivalent to 1
  MODE_ALPHA_NUM = 2, // 1 << 1 is equivalent to 2
  MODE_8BIT_BYTE = 4, // 1 << 2 is equivalent to 4
  MODE_KANJI = 8, // 1 << 3 is equivalent to 8
}

/**
 * Enumeration of QR error-correction levels.
 */
export enum QRErrorCorrectLevel {
  L = 1,
  M = 0,
  Q = 3,
  H = 2,
}

/**
 * Enumeration of QR masking patterns.
 */
export enum QRMaskPattern {
  PATTERN000 = 0,
  PATTERN001 = 1,
  PATTERN010 = 2,
  PATTERN011 = 3,
  PATTERN100 = 4,
  PATTERN101 = 5,
  PATTERN110 = 6,
  PATTERN111 = 7,
}

/**
 * Helper interface defining the structure of RS Blocks.
 */
export interface RSBlock {
  totalCount: number
  dataCount: number
  errorCount: number
}

/**
 * Config for drawing/rendering the QRCode.
 */
export interface QRCodeConfig {
  text: string
  width: number
  height: number
  colorDark: string
  colorLight: string
  correctLevel: QRErrorCorrectLevel
  useSVG: boolean
}

export type QRCodeOptions = Partial<QRCodeConfig>

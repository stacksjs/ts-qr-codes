import { Codabar } from './Codabar'
import { CODE39 } from './CODE39'
import { CODE128, CODE128A, CODE128B, CODE128C } from './CODE128'
import { EAN2, EAN5, EAN8, EAN13, UPC, UPCE } from './EAN_UPC'
import { GenericBarcode } from './GenericBarcode'
import { ITF, ITF14 } from './ITF'
import { MSI, MSI10, MSI11, MSI1010, MSI1110 } from './MSI'
import { Pharmacode } from './Pharmacode'

interface BarcodeMap {
  [key: string]: typeof GenericBarcode
}

export const barcodes: BarcodeMap = {
  CODE39,
  CODE128,
  CODE128A,
  CODE128B,
  CODE128C,
  EAN13,
  EAN8,
  EAN5,
  EAN2,
  UPC,
  UPCE,
  ITF14,
  ITF,
  MSI,
  MSI10,
  MSI11,
  MSI1010,
  MSI1110,
  Pharmacode,
  Codabar,
  GenericBarcode,
}

export default barcodes

import type { BarcodeOptions, QRCodeOptions } from '@stacksjs/qrx'
import { barcode, QRCode, QRErrorCorrectLevel } from '@stacksjs/qrx'
import { defineComponent, h, onMounted, ref, watch } from 'vue'

export const VueBarcode = defineComponent({
  name: 'VueBarcode',

  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    format: String,
    width: [String, Number],
    height: [String, Number],
    displayValue: {
      type: [String, Boolean],
      default: true,
    },
    text: [String, Number],
    fontOptions: String,
    font: String,
    textAlign: String,
    textPosition: String,
    textMargin: [String, Number],
    fontSize: [String, Number],
    background: String,
    lineColor: String,
    margin: [String, Number],
    marginTop: [String, Number],
    marginBottom: [String, Number],
    marginLeft: [String, Number],
    marginRight: [String, Number],
    flat: Boolean,
    ean128: [String, Boolean],
    elementTag: {
      type: String,
      default: 'svg',
      validator: (value: string) => ['canvas', 'svg', 'img'].includes(value),
    },
  },

  setup(props, { slots }) {
    const valid = ref(true)
    const elementRef = ref<HTMLElement | null>(null)

    function renderBarcode() {
      const el = elementRef.value
      if (!el)
        return

      const settings: BarcodeOptions = {
        format: props.format,
        width: props.width,
        height: props.height,
        displayValue: props.displayValue,
        text: props.text,
        fontOptions: props.fontOptions,
        font: props.font,
        textAlign: props.textAlign,
        textPosition: props.textPosition,
        textMargin: props.textMargin,
        fontSize: props.fontSize,
        background: props.background,
        lineColor: props.lineColor,
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        flat: props.flat,
        ean128: props.ean128,
        elementTag: props.elementTag,
        valid: (v: boolean) => {
          valid.value = v
        },
      }

      // Remove undefined props so the barcode lib uses its defaults
      for (const key of Object.keys(settings) as Array<keyof BarcodeOptions>) {
        if (settings[key] === undefined)
          delete settings[key]
      }

      try {
        barcode(el, String(props.value), settings)
      }
      catch {
        valid.value = false
      }
    }

    onMounted(renderBarcode)

    watch(() => ({ ...props }), renderBarcode, { deep: true })

    return () => h('div', [
      h(props.elementTag, {
        ref: (el: any) => { elementRef.value = el },
        style: { display: valid.value ? undefined : 'none' },
        class: 'vue-barcode-element',
      }),
      h('div', {
        style: { display: valid.value ? 'none' : undefined },
      }, slots.default?.()),
    ])
  },
})

export const VueQRCode = defineComponent({
  name: 'VueQRCode',

  props: {
    value: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 256,
    },
    height: {
      type: Number,
      default: 256,
    },
    colorDark: {
      type: String,
      default: '#000000',
    },
    colorLight: {
      type: String,
      default: '#ffffff',
    },
    correctLevel: {
      type: Number,
      default: QRErrorCorrectLevel.M,
      validator: (value: number) => [
        QRErrorCorrectLevel.L,
        QRErrorCorrectLevel.M,
        QRErrorCorrectLevel.Q,
        QRErrorCorrectLevel.H,
      ].includes(value),
    },
    useSVG: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { slots }) {
    const containerRef = ref<HTMLElement | null>(null)
    const valid = ref(true)
    let qrInstance: QRCode | null = null

    function renderQRCode() {
      const el = containerRef.value
      if (!el)
        return

      // Clear previous render
      el.innerHTML = ''

      const options: QRCodeOptions = {
        text: props.value,
        width: props.width,
        height: props.height,
        colorDark: props.colorDark,
        colorLight: props.colorLight,
        correctLevel: props.correctLevel,
        useSVG: props.useSVG,
      }

      try {
        qrInstance = new QRCode(el, options)
        valid.value = true
      }
      catch {
        valid.value = false
        qrInstance = null
      }
    }

    onMounted(renderQRCode)

    watch(() => ({ ...props }), renderQRCode, { deep: true })

    return () => h('div', [
      h('div', {
        ref: (el: any) => { containerRef.value = el },
        class: 'vue-qrcode-element',
        style: { display: valid.value ? undefined : 'none' },
      }),
      h('div', {
        style: { display: valid.value ? 'none' : undefined },
      }, slots.default?.()),
    ])
  },
})

export { QRErrorCorrectLevel } from '@stacksjs/qrx'

<script setup lang="ts">
import { barcode } from '@stacksjs/qrx'
import { nextTick, onMounted, ref, watch } from 'vue'

const error = ref('')
const text = ref('123456789')
const format = ref('CODE128')
const width = ref(2)
const height = ref(100)
const displayValue = ref(true)
const fontOptions = ref('')
const font = ref('monospace')
const textAlign = ref('center')
const textPosition = ref('bottom')
const textMargin = ref(2)
const fontSize = ref(20)
const background = ref('#ffffff')
const lineColor = ref('#ffffff')
const margin = ref(10)

const barcodeContainer = ref<HTMLElement | null>(null)

const formats = [
  'CODE128',
  'EAN13',
  'EAN8',
  'EAN5',
  'EAN2',
  'UPC',
  'CODE39',
  'ITF14',
  'MSI',
  'MSI10',
  'MSI11',
  'MSI1010',
  'MSI1110',
  'pharmacode',
  'codabar',
]

function updateBarcode() {
  if (!barcodeContainer.value)
    return

  error.value = ''

  try {
    // Create SVG element inside container
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    barcodeContainer.value.innerHTML = ''
    barcodeContainer.value.appendChild(svgElement)

    // Create new barcode
    barcode(svgElement, text.value, {
      format: format.value,
      width: Number(width.value),
      height: Number(height.value),
      displayValue: displayValue.value,
      fontOptions: fontOptions.value,
      font: font.value,
      textAlign: textAlign.value,
      textPosition: textPosition.value,
      textMargin: Number(textMargin.value),
      fontSize: Number(fontSize.value),
      background,
      lineColor: lineColor.value,
      margin: Number(margin.value),
      elementTag: 'svg',
      valid: (valid: boolean) => {
        if (!valid)
          error.value = 'Invalid barcode input for the selected format'
      },
    })
  }
  catch (err: any) {
    error.value = err.message || 'Error rendering barcode'
    console.error('Error rendering barcode:', err)
  }
}

onMounted(() => {
  // Wait for next tick to ensure DOM is ready
  nextTick(() => {
    updateBarcode()
  })
})

watch([
  text,
  format,
  width,
  height,
  displayValue,
  fontOptions,
  font,
  textAlign,
  textPosition,
  textMargin,
  fontSize,
  background,
  lineColor,
  margin,
], () => {
  updateBarcode()
})
</script>

<template>
  <div class="barcode-demo">
    <div class="controls">
      <div class="control-grid">
        <!-- Text Input -->
        <div class="input-group full-width">
          <label for="barcode-text">Text to encode:</label>
          <input
            id="barcode-text"
            v-model="text"
            type="text"
            placeholder="Enter text to encode"
          >
        </div>

        <!-- Format Selection -->
        <div class="input-group">
          <label for="format">Format:</label>
          <select
            id="format"
            v-model="format"
          >
            <option
              v-for="fmt in formats"
              :key="fmt"
              :value="fmt"
            >
              {{ fmt }}
            </option>
          </select>
        </div>

        <!-- Display Value Toggle -->
        <div class="input-group checkbox-group">
          <label>
            <input
              v-model="displayValue"
              type="checkbox"
            >
            Display Value
          </label>
        </div>

        <!-- Width Input -->
        <div class="input-group">
          <label for="width">Width:</label>
          <input
            id="width"
            v-model="width"
            type="number"
            min="1"
          >
        </div>

        <!-- Height Input -->
        <div class="input-group">
          <label for="height">Height:</label>
          <input
            id="height"
            v-model="height"
            type="number"
            min="1"
          >
        </div>

        <!-- Text Position -->
        <div class="input-group">
          <label for="text-position">Text Position:</label>
          <select
            id="text-position"
            v-model="textPosition"
          >
            <option value="bottom">
              Bottom
            </option>
            <option value="top">
              Top
            </option>
          </select>
        </div>

        <!-- Text Alignment -->
        <div class="input-group">
          <label for="text-align">Text Alignment:</label>
          <select
            id="text-align"
            v-model="textAlign"
          >
            <option value="center">
              Center
            </option>
            <option value="left">
              Left
            </option>
            <option value="right">
              Right
            </option>
          </select>
        </div>

        <!-- Font Size -->
        <div class="input-group">
          <label for="font-size">Font Size:</label>
          <input
            id="font-size"
            v-model="fontSize"
            type="number"
            min="1"
          >
        </div>

        <!-- Margin -->
        <div class="input-group">
          <label for="margin">Margin:</label>
          <input
            id="margin"
            v-model="margin"
            type="number"
            min="0"
          >
        </div>

        <!-- Line Color -->
        <div class="input-group">
          <label for="line-color">Line Color:</label>
          <input
            id="line-color"
            v-model="lineColor"
            type="color"
          >
        </div>

        <!-- Background Color -->
        <div class="input-group">
          <label for="background">Background:</label>
          <input
            id="background"
            v-model="background"
            type="color"
          >
        </div>
      </div>
    </div>

    <div class="barcode-section">
      <div
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </div>

      <div
        ref="barcodeContainer"
        class="barcode-container"
      />
    </div>
  </div>
</template>

<style scoped>
.barcode-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.controls {
  margin-bottom: 20px;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.input-group {
  margin-bottom: 0;
}

.input-group.full-width {
  grid-column: span 2;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.input-group.checkbox-group {
  display: flex;
  align-items: center;
  padding-top: 24px;
}

.input-group.checkbox-group label {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

input[type="color"] {
  width: 100%;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 40px;
  background-color: white;
  cursor: pointer;
}

input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.barcode-section {
  position: relative;
}

.error-message {
  color: #dc2626;
  margin-bottom: 15px;
  padding: 8px;
  border: 1px solid #dc2626;
  border-radius: 4px;
  background-color: #fef2f2;
}

.barcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 256px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>

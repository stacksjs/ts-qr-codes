<script setup>
import { QRCode, QRErrorCorrectLevel } from '@stacksjs/qrx'
import { onMounted, ref, watch } from 'vue'

const text = ref('Hello World!')
const errorLevel = ref(QRErrorCorrectLevel.H)
const useSVG = ref(true)
const qrContainer = ref(null)
let qrCode = null

function updateQRCode() {
  if (!qrContainer.value)
    return

  if (qrCode) {
    qrCode.clear()
  }

  qrCode = new QRCode(qrContainer.value, {
    text: text.value,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: Number.parseInt(errorLevel.value),
    useSVG: useSVG.value,
  })
}

onMounted(() => {
  updateQRCode()
})

watch([text, errorLevel, useSVG], () => {
  updateQRCode()
})
</script>

<template>
  <div class="qr-demo">
    <div class="controls">
      <div class="input-group">
        <label for="qr-text">Text to encode:</label>
        <input
          id="qr-text"
          v-model="text"
          type="text"
          placeholder="Enter text to encode"
        >
      </div>

      <div class="input-group">
        <label for="error-level">Error Correction:</label>
        <select id="error-level" v-model="errorLevel">
          <option value="1">
            Level L (7%)
          </option>
          <option value="0">
            Level M (15%)
          </option>
          <option value="3">
            Level Q (25%)
          </option>
          <option value="2">
            Level H (30%)
          </option>
        </select>
      </div>

      <div class="input-group">
        <label>
          <input v-model="useSVG" type="checkbox">
          Use SVG Renderer
        </label>
      </div>
    </div>

    <div ref="qrContainer" class="qr-container" />
  </div>
</template>

<style scoped>
.qr-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.controls {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 256px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>

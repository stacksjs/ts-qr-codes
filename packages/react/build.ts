import { generate } from '@stacksjs/dtsx'

/**
 * `sideEffects: false` is deliberately *not* set in package.json. With it, Bun
 * 1.3.14 drops the bodies of re-exported modules from this entry — `index.ts`
 * only re-exports — and still emits `export { QRCode, Barcode }`, so the bundle
 * exports bindings that were eliminated and importing it throws. Verified by
 * flipping the flag alone: 20 bytes of dangling exports with it, a real bundle
 * without. The tree-shaking hint is worth less than a package that loads.
 *
 * The wrapper used to build to `echo 'coming soon'` while its package.json
 * promised `dist/index.js` and `dist/index.d.ts` in `files` and `exports` — so
 * publishing it would have shipped an empty package. It also imported
 * `@stacksjs/qrx`, a name this repository stopped using, while depending on
 * `ts-qr-codes`: it could not have compiled against its own manifest.
 */
const built = await Bun.build({
  target: 'browser',
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  // React and the core are the consumer's, not ours to bundle: two copies of
  // React in one page is a broken app, and inlining the core would fork it.
  external: ['react', 'react-dom', 'ts-qr-codes'],
})

if (!built.success) {
  console.error(built.logs)
  process.exit(1)
}

await generate({ root: './src', outdir: './dist', entrypoints: ['index.ts'] })

if (!await Bun.file('./dist/index.d.ts').exists()) {
  console.error('dist/index.d.ts was not generated; package.json promises it in "types"')
  process.exit(1)
}

console.log('built dist/index.js and dist/index.d.ts')

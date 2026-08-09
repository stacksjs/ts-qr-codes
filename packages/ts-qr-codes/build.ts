import { generate } from '@stacksjs/dtsx'

const browser = await Bun.build({
  target: 'browser',
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
})

if (!browser.success) {
  console.error(browser.logs)
  process.exit(1)
}

const cli = await Bun.build({
  target: 'bun',
  entrypoints: ['./bin/cli.ts'],
  outdir: './dist',
})

if (!cli.success) {
  console.error(cli.logs)
  process.exit(1)
}

/**
 * Declarations, generated directly rather than through `bun-plugin-dtsx`.
 *
 * The plugin was configured here and silently emitted nothing: it resolves
 * entrypoints against its `root`, which defaults to `./src`, so the `./src/
 * index.ts` this build passes became `src/src/index.ts` and matched no file. It
 * failed quietly, the build reported success, and the package shipped with
 * `types` pointing at a `dist/index.d.ts` that was never written — so every
 * TypeScript consumer got no types at all.
 *
 * Called with entrypoints relative to the root, which is what it actually
 * wants.
 */
await generate({
  root: './src',
  outdir: './dist',
  entrypoints: ['index.ts'],
})

const declared = await Bun.file('./dist/index.d.ts').exists()
if (!declared) {
  // The failure mode this replaces was silence, so it must not be silent.
  console.error('dist/index.d.ts was not generated; package.json promises it in "types"')
  process.exit(1)
}

console.log('built dist/index.js, dist/cli.js and dist/index.d.ts')

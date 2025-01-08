import { dts } from 'bun-plugin-dtsx'

const resp = await Bun.build({
  target: 'browser',
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [dts()],
})

console.log(resp)

const resp2 = await Bun.build({
  target: 'bun',
  entrypoints: ['./bin/cli.ts'],
  outdir: './dist',
  plugins: [dts()],
})

console.log(resp2)

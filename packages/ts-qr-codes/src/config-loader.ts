import type { QRConfig } from './types'
import { loadConfig } from 'bunfig'
import { defaults } from './config'

/**
 * Load `qr.config.ts` from disk, falling back to `defaults`.
 *
 * Filesystem-only: bunfig reaches for node builtins, so this must NOT be
 * re-exported from `./index` — that entry is built for the browser. Import
 * this module directly from Bun/node (e.g. the CLI).
 */
export async function loadQRConfig(): Promise<QRConfig> {
  return await loadConfig({
    name: 'qr',
    defaultConfig: defaults,
  })
}

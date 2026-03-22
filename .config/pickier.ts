import type { PickierConfig } from 'pickier'

const config: PickierConfig = {
  verbose: false,
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/bin/**',
    '**/.git/**',
    '**/coverage/**',
    '**/*.min.js',
    '**/bun.lock',
    '**/fixtures/**',
    '**/.cache/**',
    '**/*.md',
    '**/quagga/**',
  ],

  lint: {
    extensions: ['ts', 'js', 'json', 'yaml'],
    reporter: 'stylish',
    cache: false,
    maxWarnings: -1,
  },

  format: {
    extensions: ['ts', 'js', 'json', 'yaml', 'yml'],
    trimTrailingWhitespace: true,
    maxConsecutiveBlankLines: 1,
    finalNewline: 'one',
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  rules: {
    noDebugger: 'error',
    noConsole: 'off',
  },

  pluginRules: {
    // Disable regexp false positives on regex-heavy barcode code
    'regexp/no-unused-capturing-group': 'off',
    'no-super-linear-backtracking': 'off',

    // Disable style rules that conflict with existing code patterns
    'style/brace-style': 'off',
    'max-statements-per-line': 'off',

    // Allow top-level await (common in Bun projects)
    'ts/no-top-level-await': 'off',
  },
}

export default config

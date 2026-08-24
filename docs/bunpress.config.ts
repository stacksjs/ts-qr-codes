import type { BunPressConfig } from '@stacksjs/bunpress'

const config: BunPressConfig = {
  title: 'qrx',
  description: 'A QR & Barcode Library and CLI for Node.js, Bun, and Browser',
  url: 'https://qrx.sh',

  nav: [
    { text: 'Guide', link: '/guide/getting-started' },
    { text: 'Generation', link: '/guide/generation' },
    { text: 'Reading', link: '/guide/reading' },
    { text: 'GitHub', link: 'https://github.com/stacksjs/qrx' },
  ],

  sidebar: {
    '/guide/': [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/intro' },
          { text: 'Installation', link: '/install' },
          { text: 'Getting Started', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'QR & Barcode Generation', link: '/guide/generation' },
          { text: 'Reading Codes', link: '/guide/reading' },
          { text: 'Configuration', link: '/config' },
        ],
      },
    ],
    '/features/': [
      {
        text: 'Features',
        items: [
          { text: 'QR Code Generation', link: '/features/qr-generation' },
          { text: 'Barcode Types', link: '/features/barcode-types' },
          { text: 'Scanning', link: '/features/scanning' },
          { text: 'Styling', link: '/features/styling' },
        ],
      },
    ],
    '/advanced/': [
      {
        text: 'Advanced',
        items: [
          { text: 'Configuration', link: '/advanced/configuration' },
          { text: 'Custom Renderers', link: '/advanced/custom-renderers' },
          { text: 'Performance', link: '/advanced/performance' },
          { text: 'CI/CD Integration', link: '/advanced/ci-cd' },
        ],
      },
    ],
  },

  themeConfig: {
    colors: {
      primary: '#06b6d4',
    },
  },
}

export default config

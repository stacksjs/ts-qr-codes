import type { HeadConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'
import vite from './vite.config'

// https://vitepress.dev/reference/site-config

const analyticsHead: HeadConfig[] = [
  [
    'script',
    {
      'src': 'https://cdn.usefathom.com/script.js',
      'data-site': 'PFISGDDM',
      'defer': '',
    },
  ],
]

const nav = [
  { text: 'News', link: 'https://stacksjs.org/news' },
  {
    text: 'Changelog',
    link: 'https://github.com/stacksjs/qrx/blob/main/CHANGELOG.md',
  },
  // { text: 'Blog', link: 'https://updates.ow3.org' },
  {
    text: 'Resources',
    items: [
      { text: 'Team', link: '/team' },
      { text: 'Showcase', link: '/showcase' },
      { text: 'Sponsors', link: '/sponsors' },
      { text: 'Partners', link: '/partners' },
      { text: 'Postcardware', link: '/postcardware' },
      { text: 'License', link: '/license' },
      {
        items: [
          {
            text: 'Awesome Stacks',
            link: 'https://github.com/stacksjs/awesome-stacks',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/stacksjs/stacks/blob/main/.github/CONTRIBUTING.md',
          },
        ],
      },
    ],
  },
]

const sidebar = [
  {
    text: 'Get Started',
    items: [
      { text: 'Intro', link: '/intro' },
      { text: 'Install', link: '/install' },
      { text: 'Usage', link: '/usage' },
      { text: 'Config', link: '/config' },
      { text: 'Demo', link: '/demo' },
    ],
  },
  {
    text: 'API',
    items: [
      {
        text: 'Barcodes',
        link: '/api/barcode',
        collapsed: false,
        items: [
          {
            text: 'CODE128',
            link: '/api/barcode/CODE128',
          },
          { text: 'CODE39', link: '/api/barcode/CODE39' },
          {
            text: 'EAN / UPC',
            link: '/api/barcode/EAN/',
            items: [
              { text: 'EAN-13', link: '/api/barcode/EAN/EAN-13' },
              { text: 'EAN-8', link: '/api/barcode/EAN/EAN-8' },
              { text: 'EAN-5', link: '/api/barcode/EAN/EAN-5' },
              { text: 'EAN-2', link: '/api/barcode/EAN/EAN-2' },
              { text: 'UPC-A', link: '/api/barcode/EAN/UPC-A' },
              { text: 'UPC-E', link: '/api/barcode/EAN/UPC-E' },
            ],
          },
          { text: 'ITF-14', link: '/api/barcode/ITF-14' },
          {
            text: 'MSI',
            link: '/api/barcode/MSI/',
            items: [
              { text: 'MSI10', link: '/api/barcode/MSI/MSI10' },
              { text: 'MSI11', link: '/api/barcode/MSI/MSI11' },
              { text: 'MSI1010', link: '/api/barcode/MSI/MSI1010' },
              { text: 'MSI1110', link: '/api/barcode/MSI/MSI1110' },
            ],
          },
          { text: 'Pharmacode', link: '/api/barcode/Pharmacode' },
          { text: 'Codabar', link: '/api/barcode/Codabar' },
        ],
      },
      { text: 'QR Codes', link: '/api/qr-code' },
    ],
  },
  { text: 'Showcase', link: '/showcase' },
]
const description = 'TypeScript QR & Barcode generating & reading. Lightweight & powerful.'
const title = 'qrx | QR & Barcode generating & reading. Lightweight & powerful.'

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: 'qrx',
    description,
    metaChunk: true,
    cleanUrls: true,
    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: './images/logo-mini.svg' }],
      ['link', { rel: 'icon', type: 'image/png', href: './images/logo.png' }],
      ['meta', { name: 'theme-color', content: '#0A0ABC' }],
      ['meta', { name: 'title', content: title }],
      ['meta', { name: 'description', content: description }],
      ['meta', { name: 'author', content: 'Stacks.js, Inc.' }],
      ['meta', {
        name: 'tags',
        content: 'qrx, typescript, qrcode, barcode, qr, bar, code, generate, read, lightweight, powerful, scanner, reader, decoder, encoder, stacksjs, stacks',
      }],

      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'en' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],

      ['meta', { property: 'og:site_name', content: 'qrx' }],
      ['meta', { property: 'og:image', content: 'https://ts-quick-reaction.netlify.app/images/og-image.png' }],
      ['meta', { property: 'og:url', content: 'https://ts-quick-reaction.netlify.app/' }],
      // ['script', { 'src': 'https://cdn.usefathom.com/script.js', 'data-site': '', 'data-spa': 'auto', 'defer': '' }],
      ...analyticsHead,
    ],

    themeConfig: {
      search: {
        provider: 'local',
      },
      logo: {
        light: './images/logo-transparent.svg',
        dark: './images/logo-white-transparent.svg',
      },

      nav,
      sidebar,

      editLink: {
        pattern: 'https://github.com/stacksjs/stacks/edit/main/docs/docs/:path',
        text: 'Edit this page on GitHub',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2025-present Stacks.js, Inc.',
      },

      socialLinks: [
        { icon: 'twitter', link: 'https://twitter.com/stacksjs' },
        { icon: 'bluesky', link: 'https://bsky.app/profile/chrisbreuer.dev' },
        { icon: 'github', link: 'https://github.com/stacksjs/qrx' },
        { icon: 'discord', link: 'https://discord.gg/stacksjs' },
      ],

      // algolia: services.algolia,

      // carbonAds: {
      //   code: '',
      //   placement: '',
      // },
    },

    pwa: {
      manifest: {
        theme_color: '#0A0ABC',
      },
    },

    markdown: {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },

      codeTransformers: [
        transformerTwoslash(),
      ],
    },

    vite,
  }),
)

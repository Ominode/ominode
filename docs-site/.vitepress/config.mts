import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Ominode Docs',
  description: 'Developer documentation for the Ominode AI API gateway',
  cleanUrls: true,
  lastUpdated: false,
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Billing', link: '/billing' },
      { text: 'FAQ', link: '/faq' },
      { text: 'Console', link: 'https://ominode.com' },
    ],
    sidebar: [
      { text: 'Introduction', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Models', link: '/models' },
      { text: 'Billing & Pricing', link: '/billing' },
      { text: 'Error Codes', link: '/error-codes' },
      { text: 'FAQ', link: '/faq' },
      {
        text: 'Legal',
        items: [
          { text: 'Terms of Service', link: '/terms' },
          { text: 'Privacy Policy', link: '/privacy' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/chain-works/ominode' }],
    footer: {
      message: 'Ominode — Unified AI API Gateway',
      copyright: 'Copyright © 2026 Ominode',
    },
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
    },
  },
})

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Je-suis-un-chat",
  description: "My first personal site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tag', link: '/tags' },
      { text: 'Archive', link: '/archive' }
    ],

    // 侧边栏设置为 false 以全局禁用，或者直接填空
    sidebar: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Je-suis-un-chat",
  description: "My first personal site",
  base: '/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tag', link: '/tags' },
      { text: 'Archive', link: '/archive' },
      { text: 'Category', link: '/category' }
    ],

    // 侧边栏已全局禁用（未配置 sidebar 属性）

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Je-suis-un-chat' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
        },
        link: 'mailto:je.suis.un.chat24@gmail.com'
      }
    ]
  }
})



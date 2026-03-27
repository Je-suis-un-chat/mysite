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

    // 只在特定路径下展示侧边栏
    sidebar: {
      // 四个 feature 对应页面：skills / books / movies / Blogs
      '/skills': [
        {
          text: 'Explore',
          items: [
            { text: 'Skills Stack', link: '/skills' },
            { text: 'Books', link: '/books' },
            { text: 'Movies', link: '/movies' },
            { text: 'Blogs', link: '/Blogs' }
          ]
        }
      ],
      '/books': [
        {
          text: 'Explore',
          items: [
            { text: 'Skills Stack', link: '/skills' },
            { text: 'Books', link: '/books' },
            { text: 'Movies', link: '/movies' },
            { text: 'Blogs', link: '/Blogs' }
          ]
        }
      ],
      '/movies': [
        {
          text: 'Explore',
          items: [
            { text: 'Skills Stack', link: '/skills' },
            { text: 'Books', link: '/books' },
            { text: 'Movies', link: '/movies' },
            { text: 'Blogs', link: '/Blogs' }
          ]
        }
      ],
      '/Blogs': [
        {
          text: 'Explore',
          items: [
            { text: 'Skills Stack', link: '/skills' },
            { text: 'Books', link: '/books' },
            { text: 'Movies', link: '/movies' },
            { text: 'Blogs', link: '/Blogs' }
          ]
        }
      ],

      // 博客详情页的侧边栏
      '/blog': [
        {
          text: 'Blogs',
          items: [
            { text: '随笔', link: '/blog1' },
            { text: '日志', link: '/blog2' }
          ]
        }
      ],

      // 归档页的侧边栏（可选）
      '/archive': [
        {
          text: 'Archive',
          items: [
            { text: '归档', link: '/archive' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

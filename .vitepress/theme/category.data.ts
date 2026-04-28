import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
}

export interface CategoryGroup {
  name: string
  icon: string
  description: string
  posts: Post[]
}

export interface CategoryConfig {
  name: string
  icon: string
  description: string
}

// 分类配置
const categories: CategoryConfig[] = [
  {
    name: 'tech',
    icon: '⚙️',
    description: 'Bite by Bite.'
  },
  {
    name: 'life',
    icon: '🌸',
    description: 'In Dreams We Dream.'
  }
]

export default createContentLoader('Blogs/*.md', {
  transform(raw): CategoryGroup[] {
    // 过滤并提取文章信息
    const posts: Post[] = raw
      .filter(page => page.frontmatter.date)
      .map(page => ({
        title: page.frontmatter.title || 'Untitled',
        url: page.url,
        date: page.frontmatter.date,
        category: page.frontmatter.category || 'life', // 默认为 life
        tags: page.frontmatter.tags || []
      }))
    
    // 按分类分组
    const categoryMap = new Map<string, Post[]>()
    
    posts.forEach(post => {
      const cat = post.category.toLowerCase()
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, [])
      }
      categoryMap.get(cat)!.push(post)
    })
    
    // 按日期排序每个分类内的文章
    categoryMap.forEach(catPosts => {
      catPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })
    
    // 按配置顺序生成结果
    return categories.map(cat => ({
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
      posts: categoryMap.get(cat.name) || []
    }))
  }
})
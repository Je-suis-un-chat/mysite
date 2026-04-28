import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
}

export interface YearGroup {
  year: string
  posts: Post[]
}

export default createContentLoader('Blogs/*.md', {
  transform(raw): YearGroup[] {
    // 过滤并提取文章信息
    const posts: Post[] = raw
      .filter(page => page.frontmatter.date)
      .map(page => ({
        title: page.frontmatter.title || 'Untitled',
        url: page.url,
        date: page.frontmatter.date
      }))
    
    // 按日期排序（最新的在前）
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // 按年份分组
    const yearMap = new Map<string, Post[]>()
    
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString()
      if (!yearMap.has(year)) {
        yearMap.set(year, [])
      }
      yearMap.get(year)!.push(post)
    })
    
    // 转换为数组格式，年份降序
    const yearGroups: YearGroup[] = []
    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => parseInt(b) - parseInt(a))
    
    sortedYears.forEach(year => {
      yearGroups.push({
        year,
        posts: yearMap.get(year)!
      })
    })
    
    return yearGroups
  }
})
import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  tags: string[]
}

declare const data: Post[]
export { data }

export default createContentLoader('**/*.md', {
  transform(raw) {
    return raw
      .filter(page => page.url !== '/' && page.url !== '/tags.html' && page.frontmatter.title)
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date instanceof Date ? frontmatter.date.toISOString() : frontmatter.date,
        tags: frontmatter.tags || []
      }))
      .filter(post => post.date) // ensure it has a date
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})

import { createContentLoader } from 'vitepress'

export interface BlogPostItem {
  title: string
  url: string
  date: string
  tags: string[]
}

declare const data: BlogPostItem[]
export { data }

export default createContentLoader('/Blogs/**/*.md', {
  render: false,
  transform(raw) {
    return raw
      .map(({ url, frontmatter }) => {
        const tags = Array.isArray(frontmatter?.tags)
          ? frontmatter.tags.map((t: unknown) => String(t).trim())
          : []

        return {
          title: String(frontmatter?.title || url.split('/').pop() || 'untitled'),
          url,
          date: String(frontmatter?.date || frontmatter?.lastUpdated || ''),
          tags
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})

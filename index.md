---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Je suis un chat"
  #text: "Chasing the rabbit into the infinite loop."
  #actions:
    #- theme: brand
      #text: About
      #link: /markdown-examples
    #- theme: alt
      #text: Tags
      #link: /introduce
    #- theme: brand
      #text: Home
      #link: /
    #- theme: alt
      #text: Archive
      #link: /archive

---

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from './.vitepress/theme/posts.data.ts'

const recentPosts = computed(() => posts) // 已在 posts.data.ts 中按时间排序
</script>

<div class="home-posts-container">
  <div class="recent-posts-title">最新文章</div>
  <div class="article-list">
    <a v-for="post in recentPosts" :key="post.url" :href="withBase(post.url)" class="article-item">
      <div class="article-info">
        <h2 class="title">{{ post.title }}</h2>
        <div class="tags-row" v-if="post.tags && post.tags.length">
          <span 
            v-for="tag in post.tags" 
            :key="tag" 
            class="mini-tag" 
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="date" v-if="post.date">{{ new Date(post.date).toLocaleDateString() }}</div>
    </a>
  </div>
</div>

<style scoped>
.home-posts-container {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  min-height: 100vh;
  /* 增加顶部 padding，或者让整体容器下移并处理吸附点 */
  padding-top: calc(var(--vp-nav-height) + 6rem);
  padding-bottom: 4rem;
  max-width: 1152px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.recent-posts-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  text-decoration: none !important;
  color: inherit;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.article-item:hover {
  background-color: var(--vp-c-bg-soft-up);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.article-info {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.article-item:hover .title {
  color: var(--vp-c-brand-1);
}

.tags-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mini-tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 4px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.date {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  margin-left: 1.5rem;
}

@media (max-width: 640px) {
  .article-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .date {
    margin-left: 0;
  }
}
</style>


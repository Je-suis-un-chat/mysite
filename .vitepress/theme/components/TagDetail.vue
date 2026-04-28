<script setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data.ts'
import { useScrollRestore, saveScrollPosition } from '../composables/useScrollRestore'

// 使用滚动位置还原
useScrollRestore()

const currentTag = ref('')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  currentTag.value = params.get('t') || ''
  
  // 保存来源页面（标签详情页面，包含当前标签参数）
  sessionStorage.setItem('sourcePage', '/tag.html?t=' + currentTag.value)
})

const filteredPosts = computed(() => {
  if (!currentTag.value) return posts
  return posts.filter(post => post.tags && post.tags.includes(currentTag.value))
})

// 点击文章时保存滚动位置和来源页面
const handlePostClick = () => {
  // 保存来源页面（确保正确）
  sessionStorage.setItem('sourcePage', '/tag.html?t=' + currentTag.value)
  saveScrollPosition()
}
</script>

<template>
  <ClientOnly>
    <div class="tag-header">
      <a :href="withBase('/tags.html')" class="back-link">← 返回标签云</a>
      <h1 v-if="currentTag">标签：{{ currentTag }}</h1>
      <h1 v-else>所有文章</h1>
    </div>

    <div class="article-list">
      <a v-for="post in filteredPosts" :key="post.url" :href="withBase(post.url)" class="article-item" @click="handlePostClick">
        <div class="article-info">
          <h2 class="title">{{ post.title }}</h2>
          <div class="tags-row">
            <span 
              v-for="tag in post.tags" 
              :key="tag" 
              class="mini-tag" 
              :class="{ 'is-active': tag === currentTag }"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="date">{{ new Date(post.date).toLocaleDateString() }}</div>
      </a>
    </div>
    
    <div v-if="filteredPosts.length === 0 && currentTag" class="empty-state">
      该标签下暂无文章...
    </div>
  </ClientOnly>
</template>

<style scoped>
.tag-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.7;
}

.tag-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1);
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 区别于标签卡片的「横向列表卡片」风格 */
.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1.5rem 1.25rem;
  background-color: var(--vp-c-bg-alt);
  border-radius: 8px;
  border-left: 4px solid var(--vp-c-divider);
  text-decoration: none !important;
  color: inherit;
  transition: all 0.3s ease;
}

.article-item:hover {
  background-color: var(--vp-c-bg-mute);
  border-left-color: var(--vp-c-brand-1);
  transform: translateX(6px);
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

.mini-tag.is-active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.date {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  margin-left: 1.5rem;
}

.empty-state {
  padding: 4rem 0;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 1.1rem;
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
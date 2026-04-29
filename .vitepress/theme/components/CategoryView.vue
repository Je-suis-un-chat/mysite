<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { data as categories } from '../category.data.ts'
import { useScrollRestore, saveScrollPosition } from '../composables/useScrollRestore'

// 使用滚动位置还原
useScrollRestore()

const activeCategory = ref<string | null>(null)

const totalPosts = computed(() => {
  return categories.reduce((sum, cat) => sum + cat.posts.length, 0)
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 点击文章时保存来源页面和滚动位置（分类页面）
const handlePostClick = () => {
  sessionStorage.setItem('sourcePage', '/category.html')
  saveScrollPosition()
}
</script>

<template>
  <div class="category-page">
    <!-- 统计 -->
    <div class="stats-bar">
      <span class="stats-item">
        <span class="stats-number">{{ totalPosts }}</span>
        <span class="stats-label">篇文章</span>
      </span>
      <span class="stats-divider">·</span>
      <span class="stats-item">
        <span class="stats-number">{{ categories.length }}</span>
        <span class="stats-label">个分类</span>
      </span>
    </div>
    
    <!-- 分类卡片 -->
    <div class="category-grid">
      <div 
        v-for="category in categories" 
        :key="category.name"
        class="category-card"
        :class="{ active: activeCategory === category.name, empty: category.posts.length === 0 }"
        @click="activeCategory = activeCategory === category.name ? null : category.name"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="card-icon">{{ category.icon }}</div>
          <div class="card-info">
            <h2 class="card-name">{{ category.name.toUpperCase() }}</h2>
            <p class="card-desc">{{ category.description }}</p>
          </div>
          <div class="card-count">
            <span class="count-number">{{ category.posts.length }}</span>
            <span class="count-label">篇</span>
          </div>
        </div>
        
        <!-- 文章列表（展开时显示） -->
        <Transition name="expand">
          <div v-if="activeCategory === category.name && category.posts.length > 0" class="posts-list">
            <a
              v-for="post in category.posts"
              :key="post.url"
              :href="withBase(post.url)"
              class="post-item"
              @click="handlePostClick"
            >
              <div class="post-dot"></div>
              <div class="post-content">
                <div class="post-title">{{ post.title }}</div>
                <div class="post-meta">
                  <span class="post-date">{{ formatDate(post.date) }}</span>
                  <span v-if="post.tags && post.tags.length" class="post-tags">
                    <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="mini-tag">{{ tag }}</span>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </Transition>
        
        <!-- 空状态提示 -->
        <div v-if="category.posts.length === 0" class="empty-hint">
          <span>暂无文章</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  font-style: italic;
  color: var(--vp-c-text-1);
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.page-subtitle {
  font-family: 'Lora', serif;
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.stats-item {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.stats-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #7d54de;
}

.stats-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

.stats-divider {
  color: var(--vp-c-text-3);
  opacity: 0.5;
}

.category-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: -2rem;
}

.category-card {
  width: 380px;
  max-width: 100%;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card:hover {
  border-color: rgba(125, 84, 222, 0.3);
  box-shadow: 0 4px 20px rgba(125, 84, 222, 0.1);
}

.category-card.active {
  border-color: #7d54de;
  background: linear-gradient(135deg, rgba(125, 84, 222, 0.05), rgba(168, 85, 247, 0.05));
}

.category-card.empty {
  opacity: 0.6;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.card-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.card-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: 0.05em;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-top: 0.25rem;
}

.card-count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: rgba(125, 84, 222, 0.1);
  border-radius: 20px;
}

.count-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #7d54de;
}

.count-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.posts-list {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed rgba(125, 84, 222, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.post-item:hover {
  background: rgba(125, 84, 222, 0.08);
}

.post-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7d54de;
  flex-shrink: 0;
  margin-top: 0.5rem;
  transition: transform 0.2s ease;
}

.post-item:hover .post-dot {
  transform: scale(1.3);
}

.post-content {
  flex: 1;
}

.post-title {
  font-family: 'Lora', serif;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}

.post-item:hover .post-title {
  color: #7d54de;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.post-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.post-tags {
  display: flex;
  gap: 0.25rem;
}

.mini-tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  background: rgba(125, 84, 222, 0.1);
  border-radius: 10px;
  color: var(--vp-c-text-2);
}

.empty-hint {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed rgba(125, 84, 222, 0.2);
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

/* 暗色模式 */
.dark .stats-number {
  color: #a78bfa;
}

.dark .category-card:hover {
  border-color: rgba(167, 139, 250, 0.3);
  box-shadow: 0 4px 20px rgba(167, 139, 250, 0.1);
}

.dark .category-card.active {
  border-color: #a78bfa;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.05), rgba(139, 92, 246, 0.05));
}

.dark .card-count {
  background: rgba(167, 139, 250, 0.15);
}

.dark .count-number {
  color: #a78bfa;
}

.dark .post-dot {
  background: #a78bfa;
}

.dark .post-item:hover {
  background: rgba(167, 139, 250, 0.1);
}

.dark .post-item:hover .post-title {
  color: #a78bfa;
}

.dark .mini-tag {
  background: rgba(167, 139, 250, 0.15);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.3s ease, max-height 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .category-page {
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 0.95rem;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card-icon {
    font-size: 2rem;
  }
  
  .card-name {
    font-size: 1.25rem;
  }
  
  .card-header {
    flex-wrap: wrap;
  }
  
  .card-count {
    margin-top: 0.5rem;
  }
}
</style>
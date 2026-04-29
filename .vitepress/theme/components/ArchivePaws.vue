<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as archives } from '../archives.data.ts'
import type { YearGroup } from '../archives.data.ts'
import { useScrollRestore, saveScrollPosition } from '../composables/useScrollRestore'

// 使用滚动位置还原
useScrollRestore()

// 格式化日期显示
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 点击文章时保存来源页面和滚动位置
const handlePostClick = () => {
  sessionStorage.setItem('sourcePage', '/archive.html')
  saveScrollPosition()
}
</script>

<template>
  <div class="paws-trail">
    <!-- 时间线 -->
    <div class="timeline-container">
      <div v-for="yearGroup in archives" :key="yearGroup.year" class="year-section">
        <!-- 年份标题 -->
        <div class="year-header">
          <span class="year-number">{{ yearGroup.year }}</span>
        </div>
        
        <!-- 该年份的文章列表 -->
        <div class="posts-list">
          <a
            v-for="post in yearGroup.posts"
            :key="post.url"
            :href="withBase(post.url)"
            class="post-item"
            @click="handlePostClick"
          >
            <!-- 猫爪 SVG -->
            <div class="paw-print">
              <svg viewBox="0 0 24 24" width="20" height="20" class="paw-svg">
                <!-- 大脚掌 -->
                <ellipse cx="12" cy="15" rx="5" ry="4" />
                <!-- 左上小脚趾 -->
                <ellipse cx="6" cy="8" rx="2.5" ry="3" />
                <!-- 右上小脚趾 -->
                <ellipse cx="18" cy="8" rx="2.5" ry="3" />
                <!-- 左中小脚趾 -->
                <ellipse cx="9" cy="5" rx="2" ry="2.5" />
                <!-- 右中小脚趾 -->
                <ellipse cx="15" cy="5" rx="2" ry="2.5" />
              </svg>
            </div>
            
            <!-- 文章信息 -->
            <div class="post-content">
              <div class="post-title">{{ post.title }}</div>
              <div class="post-date">{{ formatDate(post.date) }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paws-trail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
}

.trail-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  font-style: italic;
  color: var(--vp-c-text-1);
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.trail-subtitle {
  font-family: 'Lora', serif;
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0.8;
}

.timeline-container {
  position: relative;
  padding-left: 40px;
}

/* 淡淡的虚线 */
.timeline-container::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  border-left: 2px dashed rgba(125, 84, 222, 0.2);
}

.year-section {
  margin-bottom: 2.5rem;
}

.year-header {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  padding-left: 10px;
}

.year-number {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 800;
  font-style: italic;
  color: #7d54de;
  letter-spacing: -0.02em;
}

.year-label {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  opacity: 0.6;
}

.year-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-left: 1rem;
  opacity: 0.7;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin-left: -10px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.post-item:hover {
  background-color: rgba(125, 84, 222, 0.08);
}

/* 爪 SVG */
.paw-print {
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;
}

.paw-svg {
  fill: #cccccc;
  transition: fill 0.3s ease, transform 0.3s ease;
}

/* 文章信息 */
.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.post-title {
  font-family: 'Lora', serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease, transform 0.3s ease;
  line-height: 1.4;
}

.post-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  opacity: 0.7;
}

/* Hover 交互效果 */
.post-item:hover .paw-svg {
  fill: #7d54de;
  transform: scale(1.2);
}

.post-item:hover .post-title {
  color: #7d54de;
  transform: translateX(4px);
}

/* 暗色模式 */
.dark .paw-svg {
  fill: #555555;
}

.dark .year-number {
  color: #a78bfa;
}

.dark .post-item:hover {
  background-color: rgba(167, 139, 250, 0.1);
}

.dark .post-item:hover .paw-svg {
  fill: #a78bfa;
}

.dark .post-item:hover .post-title {
  color: #a78bfa;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .paws-trail {
    padding: 1.5rem 1rem;
  }
  
  .trail-title {
    font-size: 2rem;
  }
  
  .trail-subtitle {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
  
  .timeline-container {
    padding-left: 30px;
  }
  
  .timeline-container::before {
    left: 15px;
  }
  
  .year-number {
    font-size: 1.8rem;
  }
  
  .year-label {
    font-size: 1.2rem;
  }
  
  .post-title {
    font-size: 1rem;
  }
  
  .paw-print {
    width: 20px;
    height: 20px;
  }
  
  .paw-svg {
    width: 16px;
    height: 16px;
  }
}
</style>
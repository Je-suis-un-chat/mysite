<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data.ts'
import { useScrollRestore, saveScrollPosition } from '../composables/useScrollRestore'

// 使用滚动位置还原
useScrollRestore()

const tagMap = computed(() => {
  const map = {}
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        if (!map[tag]) map[tag] = 0
        map[tag]++
      })
    }
  })
  return map
})

// 点击标签时保存滚动位置
const handleTagClick = () => {
  saveScrollPosition()
}
</script>

<template>
  <div class="tags-container">
    <div class="tag-cloud">
      <a
        v-for="(count, tag) in tagMap"
        :key="tag"
        :href="withBase('/tag.html?t=' + tag)"
        class="tag"
        @click="handleTagClick"
      >
        <span class="tag-name">{{ tag }}</span>
        <span class="tag-count">({{ count }})</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.tags-container {
  margin-top: 2rem;
}

.tag-cloud {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 3rem;
}

.tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none !important;
  cursor: pointer;
  transition: border-color 0.25s, background-color 0.25s;
}

.tag:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft-up);
}

.tag-name {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.tag-count {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>


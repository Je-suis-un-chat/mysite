<script setup>
import { useRouter } from 'vitepress'

const router = useRouter()

const navigateToTags = () => {
  router.go('/tags')
}
</script>

<template>
  <button @click="navigateToTags" class="nav-tag-btn">
    Tag
  </button>
</template>

<style scoped>
.nav-tag-btn {
  padding: 6px 12px;
  margin: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-tag-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
}

.nav-tag-btn:active {
  transform: scale(0.98);
}

/* Dark mode */
.dark .nav-tag-btn {
  background-color: var(--vp-c-bg-soft);
}

.dark .nav-tag-btn:hover {
  background-color: var(--vp-c-bg-mute);
}
</style>

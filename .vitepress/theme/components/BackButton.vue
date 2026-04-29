<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'

const showButton = ref(false)
const returnUrl = ref('/')
const route = useRoute()
const router = useRouter()

const goBack = () => {
  // 从 sessionStorage 获取来源页面
  const sourcePage = sessionStorage.getItem('sourcePage')
  
  if (sourcePage) {
    // 如果来源是主页，设置标记
    if (sourcePage === '/' || sourcePage === '/#posts-container') {
      sessionStorage.setItem('isFromArticle', 'true')
      sessionStorage.setItem('skipHero', 'true')
      // 直接跳转到主页（带 base 前缀）
      window.location.href = withBase('/')
    } else {
      // 其他页面使用 window.location.href
      window.location.href = withBase(sourcePage)
    }
  } else {
    sessionStorage.setItem('isFromArticle', 'true')
    sessionStorage.setItem('skipHero', 'true')
    window.location.href = withBase('/')
  }
}

// 检查是否应该显示返回按钮
const checkShowButton = () => {
  const path = window.location.pathname
  
  // 获取来源页面
  const sourcePage = sessionStorage.getItem('sourcePage')
  
  // 只在文章详情页显示返回按钮
  const isBlogPost = path.includes('/Blogs/') || path.includes('/blogs/')
  const hasSourcePage = !!sourcePage
  
  // 只有文章页面且有来源页面时才显示返回按钮
  showButton.value = isBlogPost && hasSourcePage
  
  if (sourcePage) {
    returnUrl.value = sourcePage
  }
}

onMounted(() => {
  checkShowButton()
})

// 监听路由变化，当路由改变时重新检查
watch(() => route.path, () => {
  checkShowButton()
})
</script>

<template>
  <Transition name="fade">
    <button 
      v-if="showButton" 
      class="back-button" 
      @click="goBack"
      aria-label="返回上一页"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-button {
  position: fixed;
  top: 80px;
  left: 120px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.back-button:active {
  transform: scale(0.95);
}

/* 暗色模式 */
.dark .back-button {
  color: #60a5fa;
}

.dark .back-button:hover {
  background: rgba(96, 165, 250, 0.15);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-button {
    top: 70px;
    left: 48px;
    width: 36px;
    height: 36px;
  }
  
  .back-button svg {
    width: 20px;
    height: 20px;
  }
}
</style>
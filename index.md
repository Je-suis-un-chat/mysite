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
import { computed, ref, onMounted, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from './.vitepress/theme/posts.data.ts'

// 立即检查 skipHero 标记，在 DOM 渲染前隐藏 hero
const skipHero = sessionStorage.getItem('skipHero') === 'true'
const isFromArticle = sessionStorage.getItem('isFromArticle') === 'true'

if (skipHero) {
  // 立即添加样式隐藏 hero 区域，避免闪烁
  const style = document.createElement('style')
  style.id = 'skip-hero-style'
  style.textContent = `
    .VPHero, .VPHomeHero, .VPHero .container, .VPHero .name, .VPHero .text, .VPHero .tagline,
    [class*="hero"], .home-hero, .VPHero-has-image .image-bg {
      visibility: hidden !important;
      opacity: 0 !important;
    }
    #app { overflow: hidden !important; }
  `
  document.head.appendChild(style)
  
  // 立即滚动到顶部
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
}

const itemsPerPage = 5
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(posts.length / itemsPerPage))

const postsContainerRef = ref(null)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return posts.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 保存当前页码到 sessionStorage
    sessionStorage.setItem('blogCurrentPage', page.toString())
    if (postsContainerRef.value) {
      const topOffset = postsContainerRef.value.getBoundingClientRect().top + window.scrollY - 60
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }
}

// 点击文章链接时保存页码和来源页面
const handlePostClick = () => {
  sessionStorage.setItem('blogCurrentPage', currentPage.value.toString())
  sessionStorage.setItem('sourcePage', '/')
}

// 页面加载时恢复页码和处理锚点跳转
onMounted(() => {
  // 禁用浏览器默认滚动恢复
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  
  // 清除 sessionStorage 标记
  sessionStorage.removeItem('skipHero')
  sessionStorage.removeItem('isFromArticle')
  
  // 如果是从文章返回，临时给 #app 添加 class 禁用 scroll-snap
  if (isFromArticle) {
    const app = document.getElementById('app')
    if (app) {
      app.classList.add('from-article-return')
    }
  }
  
  // 恢复页码
  const savedPage = sessionStorage.getItem('blogCurrentPage')
  if (savedPage) {
    const page = parseInt(savedPage)
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  
  // 如果需要跳过 hero，立即滚动到文章列表
  if (skipHero) {
    // 立即滚动到顶部（文章列表区域）
    window.scrollTo(0, 0)
    
    // 使用 requestAnimationFrame 确保 DOM 渲染后移除样式并滚动
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 滚动到文章列表位置
        const articleList = document.querySelector('.article-list')
        if (articleList) {
          articleList.scrollIntoView({ behavior: 'instant', block: 'start' })
        }
        
        // 移除临时隐藏样式（由 script setup 开头添加的）
        const skipStyle = document.getElementById('skip-hero-style')
        if (skipStyle) {
          skipStyle.remove()
        }
        
        // 滚动完成后移除临时 class，恢复 scroll-snap
        setTimeout(() => {
          const app = document.getElementById('app')
          if (app) {
            app.classList.remove('from-article-return')
          }
        }, 300)
      })
    })
  }
})

</script>

<div class="home-posts-container" ref="postsContainerRef" id="posts-container">
  <div class="recent-posts-title">最新文章</div>
  <div class="article-list">
    <a v-for="post in paginatedPosts" :key="post.url" :href="withBase(post.url)" class="article-item" @click="handlePostClick">
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

  <div class="pagination" v-if="totalPages > 1">
    <button 
      class="page-btn arrow-btn" 
      :disabled="currentPage === 1" 
      @click="goToPage(currentPage - 1)"
      aria-label="Previous page">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button 
      v-for="page in totalPages" 
      :key="page" 
      class="page-btn" 
      :class="{ active: currentPage === page }"
      @click="goToPage(page)">
      {{ page }}
    </button>
    <button 
      class="page-btn arrow-btn" 
      :disabled="currentPage === totalPages" 
      @click="goToPage(currentPage + 1)"
      aria-label="Next page">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</div>

<style scoped>
.home-posts-container {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  scroll-margin-top: 60px;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
}

.page-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--vp-c-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:not(:disabled):hover {
  background-color: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.page-btn.active {
  background-color: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


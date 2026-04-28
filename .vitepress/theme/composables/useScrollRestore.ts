import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

// 需要保存滚动位置的页面路径
const SCROLL_RESTORE_PAGES = ['/tags.html', '/tag.html', '/archive.html', '/category.html']

// 保存滚动位置的 key 前缀
const SCROLL_KEY_PREFIX = 'vitepress_scroll_'

/**
 * 获取当前页面的滚动位置存储 key
 */
function getScrollKey(path: string): string {
  // 对于 tag.html，需要包含查询参数
  if (path.startsWith('/tag.html')) {
    return SCROLL_KEY_PREFIX + path
  }
  return SCROLL_KEY_PREFIX + path.split('?')[0]
}

/**
 * 保存当前页面的滚动位置
 */
export function saveScrollPosition() {
  const path = window.location.pathname + window.location.search
  const key = getScrollKey(path)
  const scrollY = window.scrollY
  sessionStorage.setItem(key, String(scrollY))
}

/**
 * 恢复页面的滚动位置
 */
export function restoreScrollPosition() {
  const path = window.location.pathname + window.location.search
  const key = getScrollKey(path)
  const savedScrollY = sessionStorage.getItem(key)
  
  if (savedScrollY) {
    // 使用 requestAnimationFrame 确保 DOM 渲染完成
    requestAnimationFrame(() => {
      window.scrollTo(0, parseInt(savedScrollY, 10))
    })
  }
}

/**
 * 清除指定页面的滚动位置记录
 */
export function clearScrollPosition(path?: string) {
  if (path) {
    const key = getScrollKey(path)
    sessionStorage.removeItem(key)
  } else {
    // 清除所有滚动位置记录
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(SCROLL_KEY_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))
  }
}

/**
 * 检查当前页面是否需要滚动还原
 */
function shouldRestoreScroll(): boolean {
  const path = window.location.pathname
  return SCROLL_RESTORE_PAGES.some(page => path.endsWith(page) || path === page.replace('.html', ''))
}

/**
 * 滚动位置还原的组合式函数
 * 在需要保存滚动位置的页面组件中使用
 */
export function useScrollRestore() {
  const router = useRouter()

  onMounted(() => {
    // 页面加载时恢复滚动位置
    if (shouldRestoreScroll()) {
      restoreScrollPosition()
    }
  })

  // 监听路由变化，在离开页面前保存滚动位置
  onUnmounted(() => {
    if (shouldRestoreScroll()) {
      saveScrollPosition()
    }
  })
}

/**
 * 自动保存点击前的滚动位置
 * 用于在点击链接跳转前保存当前滚动位置
 */
export function setupScrollSaveOnNavigate() {
  // 保存滚动位置的点击处理
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a[href]')
    
    if (link && shouldRestoreScroll()) {
      saveScrollPosition()
    }
  }

  // 使用事件委托
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClick, true)
    
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }
  
  return () => {}
}
import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vitepress'

// 滚动恢复黑名单 - 这些页面禁止执行滚动恢复，始终保持在顶部
const SCROLL_RESTORE_BLACKLIST = ['/', '/index.html']

// 需要保存滚动位置的页面路径（白名单）
const SCROLL_RESTORE_PAGES = ['/tags.html', '/tag.html', '/archive.html', '/category.html']

// sessionStorage key 前缀
const SCROLL_KEY_PREFIX = 'scroll_pos_'

// 最大等待时间（毫秒）
const MAX_WAIT_TIME = 300

// 内容容器选择器
const CONTENT_SELECTOR = '#VPContent'

/**
 * 检查是否为 SSR 环境
 */
function isClient(): boolean {
  return typeof window !== 'undefined' && !import.meta.env.SSR
}

/**
 * 检查目标路径是否在黑名单中（主页等）
 */
function isBlacklisted(path: string): boolean {
  const normalizedPath = path.split('?')[0].replace(/\/$/, '') || '/'
  return SCROLL_RESTORE_BLACKLIST.includes(normalizedPath) || normalizedPath === ''
}

/**
 * 检查当前页面是否需要滚动还原
 */
function shouldRestoreScroll(): boolean {
  const path = window.location.pathname
  return SCROLL_RESTORE_PAGES.some(page => path.endsWith(page) || path === page.replace('.html', ''))
}

/**
 * 根据路由路径生成存储 key
 */
function getScrollKey(path: string): string {
  const cleanPath = path.split('?')[0]
  return SCROLL_KEY_PREFIX + cleanPath
}

/**
 * 保存当前页面的滚动位置
 */
export function saveScrollPosition() {
  if (!isClient()) return
  
  const path = window.location.pathname + window.location.search
  const key = getScrollKey(path)
  sessionStorage.setItem(key, String(window.scrollY))
}

/**
 * 恢复页面的滚动位置
 */
export function restoreScrollPosition() {
  if (!isClient()) return
  
  const path = window.location.pathname
  const search = window.location.search
  const fullKey = getScrollKey(path + search)
  
  const savedScrollY = sessionStorage.getItem(fullKey)
  if (!savedScrollY) return
  
  const targetY = parseInt(savedScrollY, 10)
  if (isNaN(targetY) || targetY <= 0) return
  
  // 禁用浏览器默认滚动恢复
  window.history.scrollRestoration = 'manual'
  
  // 检查黑名单 - 主页始终回到顶部
  if (isBlacklisted(path)) {
    window.scrollTo(0, 0)
    return
  }
  
  // 立即尝试滚动
  tryImmediateScroll(targetY)
}

/**
 * 尝试立即滚动到目标位置
 * 如果高度不够，设置 ResizeObserver 监听
 */
function tryImmediateScroll(targetY: number): void {
  const currentHeight = document.documentElement.scrollHeight
  const viewportHeight = window.innerHeight
  
  // 如果当前高度已经足够，立即滚动
  if (currentHeight >= targetY + viewportHeight * 0.5) {
    window.scrollTo(0, targetY)
    return
  }
  
  // 高度不够，使用 ResizeObserver 监听
  setupResizeObserver(targetY)
}

/**
 * 使用 ResizeObserver 监听内容高度变化
 */
function setupResizeObserver(targetY: number): void {
  const contentEl = document.querySelector(CONTENT_SELECTOR) || document.body
  
  let timeoutId: number | null = null
  let observer: ResizeObserver | null = null
  
  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  
  const tryScroll = () => {
    const currentHeight = document.documentElement.scrollHeight
    const viewportHeight = window.innerHeight
    
    if (currentHeight >= targetY + viewportHeight * 0.5) {
      window.scrollTo(0, targetY)
      cleanup()
    }
  }
  
  // 设置 ResizeObserver
  observer = new ResizeObserver(() => {
    tryScroll()
  })
  
  observer.observe(contentEl)
  observer.observe(document.documentElement)
  
  // 兜底超时机制
  timeoutId = window.setTimeout(() => {
    window.scrollTo(0, targetY)
    cleanup()
  }, MAX_WAIT_TIME)
}

/**
 * 滚动位置还原的组合式函数
 */
export function useScrollRestore() {
  if (!isClient()) return
  
  const router = useRouter()
  const route = useRoute()
  
  let cleanupNavigate: (() => void) | null = null
  
  onMounted(() => {
    // 禁用浏览器默认滚动恢复
    window.history.scrollRestoration = 'manual'
    
    // 页面加载时恢复滚动位置
    if (shouldRestoreScroll()) {
      restoreScrollPosition()
    }
    
    // 监听链接点击，在跳转前保存滚动位置
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      
      if (link && shouldRestoreScroll()) {
        saveScrollPosition()
      }
    }
    
    document.addEventListener('click', handleClick, true)
    cleanupNavigate = () => document.removeEventListener('click', handleClick, true)
  })
  
  onUnmounted(() => {
    // 离开页面前保存滚动位置
    if (shouldRestoreScroll()) {
      saveScrollPosition()
    }
    
    if (cleanupNavigate) {
      cleanupNavigate()
    }
  })
}

/**
 * 清除指定页面的滚动位置记录
 */
export function clearScrollPosition(path?: string) {
  if (!isClient()) return
  
  if (path) {
    const key = getScrollKey(path)
    sessionStorage.removeItem(key)
  } else {
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
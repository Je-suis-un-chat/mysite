<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 设置显示语句、逐字出现和删除的时间间隔、显示完一句话后的停顿时间
const intro = [
  '面对大河 我无限惭愧 我年华虚度 空有一身疲倦',
  'In Solitude, Where We Are Least Alone.',
  '这个世界不可理喻，爱它却是我的宿命。',
  'Do not go gentle into that good night.',
  '过去都是假的，回忆是一条没有归途的路，唯有孤独永恒。',
  '不要就这样 把我留在夜晚和苦痛中。',
  'And miles to go before I sleep.',
  "Shall I compare thee to a summer's day?",
  'But thy eternal summer shall not fade.'
],
  dynamicIntro = ref(''),
  typingSpeed = 150,
  deletingSpeed = 50,
  pauseTime = 900

// 初始化
let introIndex = 0,
  charIndex = 0,
  isDeleting = false,
  timer = null

// 打字机效果实现
function typingEffect() {
  const currentIntro = intro[introIndex]

  // 如果当前不是删除状态
  if (!isDeleting) {
    // 逐个增加字符，并递增字符索引
    dynamicIntro.value = currentIntro.substring(0, charIndex + 1)
    charIndex++

    // 如果一句已经全部显示，则切换为删除状态，并等待900ms
    if (charIndex == currentIntro.length) {
      timer = setTimeout(() => {
        isDeleting = true
        typingEffect()
      }, pauseTime)
      return
    }
  } else {
    // 如果当前为删除状态，逐个减少字符，并递减字符索引
    dynamicIntro.value = currentIntro.substring(0, charIndex + 1)
    charIndex--

    // 如果一句已全部删除，则切换为非删除状态，并将intro索引切换到下一句
    if (charIndex == 0) {
      isDeleting = false
      introIndex = (introIndex + 1) % intro.length
    }
  }

  // 根据当前状态决定下次执行的间隔时间
  timer = setTimeout(typingEffect, isDeleting ? deletingSpeed : typingSpeed)
}

// 页面加载完成后，等待1.3秒再开始打字机效果
onMounted(() => {
  timer = setTimeout(() => {
    typingEffect()
  }, 1300)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="typewriter-container">
    <p class="site-author-intro tag-line">
      {{ dynamicIntro }}
    </p>
  </div>
</template>

<style scoped>
.typewriter-container {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

@media (min-width: 640px) {
  .typewriter-container {
    margin-top: 16px;
  }
}

@media (min-width: 960px) {
  .typewriter-container {
    justify-content: flex-start;
  }
}

.site-author-intro {
  margin: 0;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
  font-size: 24px;
  min-height: 1.5em;
}

/* 在文字后添加闪烁光标 */
.site-author-intro::after {
  content: '|';
  animation: blink 1s infinite;
  margin-left: 2px;
  color: var(--vp-c-brand);
}

/* 闪烁动画 */
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
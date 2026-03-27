<template>
  <div class="scroll-down-container" @click="scrollToFeatures">
    <div class="scroll-down-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
          <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
        </svg>
    </div>
  </div>
</template>

<script setup>
const scrollToFeatures = () => {
  const target = document.querySelector('.VPFeatures')
  const appContainer = document.querySelector('#app')
  if (target && appContainer) {
    const offset = 64
    const elementPosition = target.offsetTop
    const offsetPosition = elementPosition - offset

    appContainer.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.scroll-down-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  margin-top: -100px; /* Pull it up from below the fold into the hero section */
  z-index: 10;
  cursor: pointer;
  pointer-events: auto;
}

.scroll-down-arrow {
  animation: bounce 2s infinite;
  color: var(--vp-c-text-2);
  transition: color 0.3s ease;
}

.scroll-down-arrow:hover {
  color: var(--vp-c-brand-1);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7px);
  }
}
</style>
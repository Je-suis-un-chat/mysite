<template>
  <!-- Background Cat Container -->
  <div 
    class="background-cat-wrapper" 
    ref="catWrapper"
    :style="{ transform: `translateX(${currentX}px)` }"
  >
    <!-- oh-my-live2d will be mounted inside this div -->
    <div id="oml2d-cat-mount" @mouseenter="onHoverEnter" @mouseleave="onHoverLeave"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const catWrapper = ref(null)
const currentX = ref(0)
let hoverTimer = null
let roamInterval = null
let isHovered = ref(false)

onMounted(async () => {
  // Dynamically import oh-my-live2d to prevent SSR errors during VitePress build
  const { loadOml2d } = await import('oh-my-live2d')

  // Initialize the cat
  loadOml2d({
    parentElement: document.getElementById('oml2d-cat-mount'),
    models: [
      {
        path: 'https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json',
        scale: 0.12,
        position: [0, 80],
        stageStyle: {
          width: '250px',
          height: '250px'
        }
      }
    ],
    menus: {
      disable: true // We disable menus for a purer ambient background feel
    },
    statusBar: {
      disable: true // Disable the loading status bar
    },
    tips: {
      style: {
        display: 'none' // Disable tips box to prevent blocking
      }
    }
  })

  // Start the subtle roaming behavior
  startRoaming()
})

// --- Roaming Logic ---

const startRoaming = () => {
  if (roamInterval) clearInterval(roamInterval)
  
  roamInterval = setInterval(() => {
    if (isHovered.value) return // Don't roam while being petted (hovered)
    
    // Pick a random X position along the bottom screen width
    // max width minus the approximate cat width (250px)
    const maxX = Math.max(0, window.innerWidth - 250)
    
    // Slight wandering, not crossing the whole screen at once to make it natural
    const maxStep = 300 
    const direction = Math.random() > 0.5 ? 1 : -1
    const distance = Math.random() * maxStep
    
    let newX = currentX.value + (distance * direction)
    
    // Keep it in bounds
    if (newX < 0) newX = 0
    if (newX > maxX) newX = maxX
    
    currentX.value = newX
  }, 4000) // Decides to walk every 4 seconds
}

const onHoverEnter = () => {
  isHovered.value = true
  // Let the Live2D model look at the cursor (automatically handled by oh-my-live2d core)
}

const onHoverLeave = () => {
  // Give it a brief pause after petting before returning to roaming
  hoverTimer = setTimeout(() => {
    isHovered.value = false
  }, 2000)
}

onUnmounted(() => {
  if (roamInterval) clearInterval(roamInterval)
  if (hoverTimer) clearTimeout(hoverTimer)
})
</script>

<style scoped>
.background-cat-wrapper {
  position: fixed;
  bottom: -20px; /* Hide the very bottom crop */
  left: 0;
  z-index: -1; /* Placed behind foreground content */
  pointer-events: none; /* Container doesn't block text selection on the page */
  will-change: transform;
  transition: transform 3s ease-in-out; /* Smooth sliding */
}

/* Re-enable pointer events ONLY for the inner Live2D mount so the Cat can be clicked */
#oml2d-cat-mount {
  pointer-events: auto;
  cursor: pointer;
}

/* Ensure the wrapper doesn't cause page horizontal scrolling */
@media (max-width: 768px) {
  .background-cat-wrapper {
    display: none; /* Optional: hide on mobile screens to save space and performance */
  }
}
</style>

<template>
  <ClientOnly>
    <div>
      <div
        v-if="isMounted"
        class="oneko"
        :class="{ 'grabbed': isGrabbed }"
        :style="{
          left: `${catX}px`,
          top: `${catY}px`,
          backgroundPosition: `${bgPosX}px ${bgPosY}px`,
          cursor: isGrabbed ? 'grabbing' : 'grab'
        }"
        @dblclick="toggleFollowMode"
        @mousedown.prevent="startGrab"
        @contextmenu.prevent="showContextMenu"
      ></div>

      <!-- 宠物皮肤右键菜单 -->
      <div
        v-if="isMenuOpen"
        class="oneko-menu"
        :style="{ left: menuX + 'px', top: menuY + 'px' }"
      >
        <div class="menu-item" @click="changeSkin('white')">🐱 Classic</div>
        <div class="menu-item" @click="changeSkin('black')">🐈‍⬛ vaporwave</div>
        <div class="menu-item" @click="changeSkin('dog')">🐶 Doggo</div>
        <div class="menu-item" @click="changeSkin('wizard')">🧙‍♂️ tora</div>
        <div class="menu-item" @click="changeSkin('maia')">😶‍🌫️ maia</div>

      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'


// 皮肤/主题配置
const skins = {
  white: 'https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif',
  black: '/oneko-vaporwave.gif', 
  dog: '/oneko-dog.gif',     
  wizard: '/oneko-tora.gif',
  maia: '/oneko-maia.gif'
}

// --- State & Position ---
const isMounted = ref(false)
const catX = ref(32)
const catY = ref(32)
const mouseX = ref(32)
const mouseY = ref(32)
const isFollowing = ref(true) // Track whether the cat is currently following the cursor

const isGrabbed = ref(false)
let grabOffsetX = 0
let grabOffsetY = 0
let grabStartX = 0
let grabStartY = 0
let grabStop = true
let grabInterval = null
let dragDirection = 'alert'

// Context Menu State
const isMenuOpen = ref(false)
const menuX = ref(0)
const menuY = ref(0)

// Gravity / Falling state
const isFalling = ref(false)
let fallVelocityY = 0
const gravity = 1.5

// Target Element state
const targetElement = ref(null)


// Sprite variables
const bgPosX = ref(0)
const bgPosY = ref(0)

const currentSkin = ref('white')
const spriteUrl = ref(`url("${skins.white}")`)

// Constants
const speed = 2 // Movement speed (reduced from 10 to 6 for a more balanced pace)
const idleTimeoutReset = 90 // Frames before triggering idle behavior

// Internal engine state
let frameCount = 0
let idleTime = 0
let idleAnimation = null
let idleAnimationFrame = 0
let lastFrameTime = 0
let animationFrameId = null

// --- Sprite Map Definitions ---
const spriteSets = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
}

// --- Logic functions ---
const setSprite = (name, frame) => {
  const sprite = spriteSets[name][frame % spriteSets[name].length]
  bgPosX.value = sprite[0] * 32
  bgPosY.value = sprite[1] * 32
}

const resetIdleAnimation = () => {
  idleAnimation = null
  idleAnimationFrame = 0
}

const idle = () => {
  idleTime += 1

  if (
    idleTime > idleTimeoutReset &&
    Math.floor(Math.random() * 200) === 0 &&
    idleAnimation == null
  ) {
    let availableIdleAnimations = ['sleeping', 'scratchSelf']
    
    if (catX.value < 32) availableIdleAnimations.push('scratchWallW')
    if (catY.value < 32) availableIdleAnimations.push('scratchWallN')
    if (catX.value > window.innerWidth - 32) availableIdleAnimations.push('scratchWallE')
    if (catY.value > window.innerHeight - 32) availableIdleAnimations.push('scratchWallS')
    
    idleAnimation =
      availableIdleAnimations[
        Math.floor(Math.random() * availableIdleAnimations.length)
      ]
  }

  switch (idleAnimation) {
    case 'sleeping':
      if (idleAnimationFrame < 8) {
        setSprite('tired', 0)
        break
      }
      setSprite('sleeping', Math.floor(idleAnimationFrame / 4))
      if (idleAnimationFrame > 192) {
        resetIdleAnimation()
      }
      break
    case 'scratchWallN':
    case 'scratchWallS':
    case 'scratchWallE':
    case 'scratchWallW':
    case 'scratchSelf':
      setSprite(idleAnimation, idleAnimationFrame)
      if (idleAnimationFrame > 9) {
        resetIdleAnimation()
      }
      break
    default:
      setSprite('idle', 0)
      return
  }
  idleAnimationFrame += 1
}

const update = (timestamp) => {
  if (!lastFrameTime) lastFrameTime = timestamp
  const delta = timestamp - lastFrameTime

  // If the cat is being grabbed, override logic
  if (isGrabbed.value) {
    if (delta > 90) { // animate scratch logic
      lastFrameTime = timestamp
      frameCount += 1
    }
    // dynamically set scratch sprite based on drag direction
    if (grabStop) {
      setSprite('alert', 0)
    } else {
      setSprite(dragDirection, frameCount)
    }
    animationFrameId = requestAnimationFrame(update)
    return
  }

  // Handle Gravity / Falling
  if (isFalling.value) {
    if (delta > 30) {
      lastFrameTime = timestamp
      setSprite('tired', 0) // Look shocked/falling
      
      // Apply gravity physics
      fallVelocityY += gravity
      catY.value += fallVelocityY
      
      // Stop falling when hitting the bottom of the screen
      if (catY.value >= window.innerHeight - 16) {
        catY.value = window.innerHeight - 16
        isFalling.value = false
        fallVelocityY = 0
        
        // Show impact animation/state
        idleTime = idleTimeoutReset + 1
        idleAnimation = 'scratchSelf'
        idleAnimationFrame = 0
      }
    }
    animationFrameId = requestAnimationFrame(update)
    return
  }

  // By increasing delta cap, we slow down how fast the sprite frames update (leg movement / shaking frequency)
  // 100ms looks like classic retro speed, let's restore it to around 90-100 range to fix the hyper-shaking
  if (delta > 90) {
    lastFrameTime = timestamp

    // Check if there's a target element to sit on
    if (targetElement.value && isFollowing.value) {
      const rect = targetElement.value.getBoundingClientRect()
      // Target position is the top center of the element
      const targetX = rect.left + rect.width / 2
      const targetY = rect.top - 16 // Sit right on top of the border/text

      const diffX = catX.value - targetX
      const diffY = catY.value - targetY
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2)

      if (distance < 10) {
        // Cat arrived at the top of the element, lock position and sleep
        catX.value = targetX
        catY.value = targetY
        setSprite('sleeping', Math.floor(frameCount / 4))
        frameCount++
        animationFrameId = requestAnimationFrame(update)
        return
      } else {
        // Walk towards the element top
        let direction = ''
        direction = diffY / distance > 0.5 ? 'N' : ''
        direction += diffY / distance < -0.5 ? 'S' : ''
        direction += diffX / distance > 0.5 ? 'W' : ''
        direction += diffX / distance < -0.5 ? 'E' : ''
        
        setSprite(direction || 'idle', frameCount)
        catX.value -= (diffX / distance) * speed * 10
        catY.value -= (diffY / distance) * speed * 10
        frameCount++
        animationFrameId = requestAnimationFrame(update)
        return
      }
    }

    // Default mouse tracking logic
    const diffX = catX.value - mouseX.value
    const diffY = catY.value - mouseY.value
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2)

    // If not following or if very close, stay idle
    if (!isFollowing.value || distance < 48) {
      idle()
      animationFrameId = requestAnimationFrame(update)
      return
    }

    // Stop jittering: calculate the exact step we are about to take.
    // If the step we take is larger than the distance to the mouse, it causes overshooting and jumping back and forth (抽搐).
    // So if we're going to overshoot, just snap to the target radius and go idle.
    const stepSize = speed * 10
    if (distance < stepSize) {
      idle()
      animationFrameId = requestAnimationFrame(update)
      return
    }

    idleAnimation = null
    idleAnimationFrame = 0
    
    if (idleTime > 1) {
      setSprite('alert', 0)
      idleTime = Math.min(idleTime, 1) // reduced from 7 to 1 so it reacts and wakes up instantly without delay
      idleTime -= 1
      animationFrameId = requestAnimationFrame(update)
      return
    }

    let direction = ''
    direction = diffY / distance > 0.5 ? 'N' : ''
    direction += diffY / distance < -0.5 ? 'S' : ''
    direction += diffX / distance > 0.5 ? 'W' : ''
    direction += diffX / distance < -0.5 ? 'E' : ''
    
    setSprite(direction || 'idle', frameCount)

    // Calculate step size based on speed
    const stepDiffX = (diffX / distance) * speed * 10
    const stepDiffY = (diffY / distance) * speed * 10

    // Move cat closer
    catX.value -= stepDiffX
    catY.value -= stepDiffY
    
    catX.value = Math.min(Math.max(16, catX.value), window.innerWidth - 16)
    catY.value = Math.min(Math.max(16, catY.value), window.innerHeight - 16)

    frameCount += 1
  }

  animationFrameId = requestAnimationFrame(update)
}

const handleMouseMove = (e) => {
  mouseX.value = e.clientX - 16
  mouseY.value = e.clientY - 16

  if (isGrabbed.value) {
    catX.value = e.clientX - grabOffsetX
    catY.value = e.clientY - grabOffsetY

    const deltaX = e.clientX - grabStartX
    const deltaY = e.clientY - grabStartY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Calculate drag direction specifically for counter-scratching
    if (absDeltaX > absDeltaY && absDeltaX > 10) {
      dragDirection = deltaX > 0 ? 'scratchWallW' : 'scratchWallE'
    } else if (absDeltaY > absDeltaX && absDeltaY > 10) {
      dragDirection = deltaY > 0 ? 'scratchWallN' : 'scratchWallS'
    }

    if (grabStop || absDeltaX > 10 || absDeltaY > 10 || Math.sqrt(deltaX ** 2 + deltaY ** 2) > 10) {
      grabStop = false
      clearTimeout(grabInterval)
      grabInterval = setTimeout(() => {
        grabStop = true
        grabStartX = e.clientX
        grabStartY = e.clientY
      }, 150)
    }
  }
}

// Global mouseout event triggers when cursor leaves the document window entirely
const handleMouseOut = (e) => {
  if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
    // Cursor left the screen -> Trigger Falling from top
    if (isFollowing.value && !isGrabbed.value) {
      catX.value = Math.max(16, Math.min(window.innerWidth - 16, e.clientX || mouseX.value))
      catY.value = -32 // Teleport above the screen
      isFalling.value = true
      fallVelocityY = 0
    }
  }
}

// Target specific elements to rest on their top edge
const handleMouseOverElement = (e) => {
  if (!e.target || !e.target.tagName) return
  const tag = e.target.tagName.toLowerCase()
  const cls = typeof e.target.className === 'string' ? e.target.className : ''

  // Check if we hovered over an h1 or some prominent content blocks
  if (tag === 'h1' || (tag === 'div' && cls.includes('VPFeature'))) {
    targetElement.value = e.target
  } else {
    targetElement.value = null
  }
}

const startGrab = (e) => {
  isGrabbed.value = true
  grabStop = true
  grabStartX = e.clientX
  grabStartY = e.clientY
  dragDirection = 'alert'
  grabOffsetX = e.clientX - catX.value
  grabOffsetY = e.clientY - catY.value
  document.addEventListener('mouseup', endGrab)
}

const endGrab = () => {
  isGrabbed.value = false
  grabStop = true
  if (grabInterval) clearTimeout(grabInterval)
  document.removeEventListener('mouseup', endGrab)
}

const toggleFollowMode = () => {
  isFollowing.value = !isFollowing.value
  
  if (!isFollowing.value) {
    // When stopping, trigger sit immediately
    idleTime = idleTimeoutReset + 1
    idleAnimation = 'sleeping'
    idleAnimationFrame = 0
  } else {
    // When starting, trigger wake up
    idleAnimation = null
    idleAnimationFrame = 0
    idleTime = 0
  }
}

// ------ Context Menu Logic ------
const showContextMenu = (e) => {
  isMenuOpen.value = true
  menuX.value = e.clientX
  menuY.value = e.clientY

  const closeMenu = () => {
    isMenuOpen.value = false
    document.removeEventListener('click', closeMenu)
    document.removeEventListener('contextmenu', closeMenu)
  }
  
  // Use setTimeout to avoid immediate event bubbling triggering closeMenu
  setTimeout(() => {
    document.addEventListener('click', closeMenu)
    document.addEventListener('contextmenu', closeMenu)
  }, 10)
}

const changeSkin = (skinKey) => {
  if (skins[skinKey]) {
    currentSkin.value = skinKey
    spriteUrl.value = `url("${skins[skinKey]}")`
    
    // 如果不同皮肤的雪碧图尺寸不同，可以在这里处理 coordinate 偏移逻辑
    // 根据需求增加判断
  }
}

onMounted(() => {
  isMounted.value = true
  
  catX.value = window.innerWidth / 2 - 16
  catY.value = window.innerHeight / 2 - 16
  mouseX.value = window.innerWidth / 2
  mouseY.value = window.innerHeight / 2

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseOut) // Trigger when mouse leaves window
  document.addEventListener('mouseover', handleMouseOverElement) // Tracking hovered elements
  animationFrameId = requestAnimationFrame(update)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseOut)
  document.removeEventListener('mouseover', handleMouseOverElement)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.oneko {
  position: fixed;
  width: 32px;
  height: 32px;
  background-image: v-bind('spriteUrl');
  image-rendering: pixelated;
  z-index: 9999;
  pointer-events: auto; /* Enable clicking so we can toggle follow mode and drag */
  transform: translate(-50%, -50%) scale(1.5); /* added scale(1.5) to make the cat larger */
  user-select: none; /* Prevent text selection while dragging */
}

/* Optional: add a generic drop shadow or rotation when picked up */
.oneko.grabbed {
  filter: drop-shadow(0 15px 10px rgba(0,0,0,0.3));
  transform: translate(-50%, -50%) scale(1.5);
}

/* Context Menu Profile */
.oneko-menu {
  position: fixed;
  z-index: 10000;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px 0;
  min-width: 140px;
  font-size: 14px;
  font-family: sans-serif;
}

/* Dark mode support if VitePress uses dark mode */
:root.dark .oneko-menu {
  background: #242424;
  border: 1px solid #444;
  color: #eee;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item:hover {
  background: #f0f0f0;
}

:root.dark .menu-item:hover {
  background: #3a3a3a;
}
</style>
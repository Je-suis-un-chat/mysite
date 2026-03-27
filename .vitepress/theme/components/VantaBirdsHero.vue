<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useData } from 'vitepress'
import BIRDS from 'vanta/dist/vanta.birds.min'
import * as THREE from 'three'

const vantaRef = ref(null)
let vantaEffect = null
const { isDark } = useData()

const initVanta = async () => {
  if (typeof window === 'undefined') return
  
  await nextTick()
  if (!vantaRef.value) return

  // Vanta often expects window.THREE global
  if (!window.THREE) window.THREE = THREE

  const bg = isDark.value ? 0x1e1e20 : 0xffffff

  try {
    vantaEffect = BIRDS({
      el: vantaRef.value,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.80,
      color1: 0x7d54de,
      color2: 0x3764ef,
      colorMode: 'varianceGradient',
      quantity: 4.00,
      birdSize: 1.40,
      wingSpan: 29.00,
      speedLimit: 5.00,
      separation: 20.00,
      alignment: 10.00,
      cohesion: 63.00,
      backgroundAlpha: 1.00,
      backgroundColor: bg
    })
  } catch (error) {
    console.error('[Vanta] Init failed:', error)
  }
}

watch(isDark, (val) => {
  if (vantaEffect) {
    vantaEffect.setOptions({
      backgroundColor: val ? 0x1e1e20 : 0xffffff
    })
  }
})

onMounted(() => {
  initVanta()
})

onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy()
})
</script>

<template>
  <div class="vanta-hero-bg" ref="vantaRef"></div>
</template>

<style scoped>
.vanta-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* Covers the full viewport height for the hero */
  z-index: 0; /* Sit behind the hero content (which should be z-index 1 or higher) */
  overflow: hidden;
  /* Ensure interaction works but doesn't block hero buttons. 
     If hero content is relative and z-index 1, it will sit on top. 
  */
}
</style>
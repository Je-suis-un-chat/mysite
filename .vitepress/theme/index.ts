import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Oneko from './components/Oneko.vue'
import ScrollDown from './components/ScrollDown.vue'
import VantaBirdsHero from './components/VantaBirdsHero.vue'
import TypewriterHero from './components/TypewriterHero.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(Oneko),
      'home-hero-after': () => h(ScrollDown),
      'home-hero-before': () => h(VantaBirdsHero),
      'home-hero-info-after': () => h(TypewriterHero)
    })
  }
}

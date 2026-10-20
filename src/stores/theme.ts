import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('light')
  const isDark = computed(() => mode.value === 'dark')

  function apply(nextMode: ThemeMode) {
    mode.value = nextMode
    document.documentElement.classList.toggle('dark', nextMode === 'dark')
    document.documentElement.dataset.theme = nextMode
    document.documentElement.style.colorScheme = nextMode
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nextMode === 'dark' ? '#0b1511' : '#f2f3ef')
  }

  function init() {
    const saved = localStorage.getItem('seongsu-one-theme') as ThemeMode | null
    apply(saved === 'dark' || saved === 'light' ? saved : 'light')
  }

  function toggle() {
    const nextMode = isDark.value ? 'light' : 'dark'
    setMode(nextMode)
  }

  function setMode(nextMode: ThemeMode) {
    apply(nextMode)
    localStorage.setItem('seongsu-one-theme', nextMode)
  }

  return { mode, isDark, init, toggle, setMode }
})


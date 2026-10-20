<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Menu, Search, ChevronDown, Moon, Sun } from '@lucide/vue'
import { useAppStore } from '../stores/app'
import { useThemeStore } from '../stores/theme'

defineEmits<{ menu: [] }>()
const route = useRoute()
const store = useAppStore()
const theme = useThemeStore()
const showNotices = ref(false)
</script>

<template>
  <header class="sticky top-0 z-30 flex h-[86px] items-center justify-between border-b border-black/5 bg-[#f2f3ef]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
    <div class="flex min-w-0 items-center gap-4">
      <button class="rounded-xl border border-black/8 bg-white p-2.5 lg:hidden" aria-label="메뉴 열기" @click="$emit('menu')"><Menu :size="19" /></button>
      <div class="min-w-0"><p class="label truncate">{{ route.meta.eyebrow }}</p><h1 class="mt-1 truncate text-xl font-semibold tracking-[-.035em] sm:text-2xl">{{ route.meta.title }}</h1></div>
    </div>
    <div class="flex items-center gap-2 sm:gap-3">
      <label class="hidden h-10 w-56 items-center gap-2 rounded-xl border border-black/8 bg-white px-3 text-black/35 xl:flex"><Search :size="16" /><input class="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none" placeholder="공간, 예약 검색" /></label>
      <button class="theme-toggle grid size-10 place-items-center rounded-xl border border-black/8 bg-white text-black/55 transition hover:-translate-y-0.5 hover:text-black" :aria-label="theme.isDark ? '라이트 모드로 전환' : '다크 모드로 전환'" :title="theme.isDark ? '라이트 모드' : '다크 모드'" @click="theme.toggle()">
        <Sun v-if="theme.isDark" :size="18" />
        <Moon v-else :size="18" />
      </button>
      <div class="relative">
        <button class="relative grid size-10 place-items-center rounded-xl border border-black/8 bg-white text-black/55 transition hover:text-black" aria-label="알림" @click="showNotices = !showNotices">
          <Bell :size="18" />
          <span v-if="store.unreadNotices" class="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-clay"></span>
        </button>
        <Transition name="fade"><div v-if="showNotices" class="card absolute right-0 top-13 w-[min(360px,calc(100vw-2rem))] overflow-hidden p-2 shadow-2xl">
          <div class="flex items-center justify-between px-3 py-2"><b class="text-sm">알림 {{ store.unreadNotices }}건</b><button class="text-[11px] font-semibold text-forest" @click="store.markNoticesRead()">모두 읽음</button></div>
          <button v-for="notice in store.notices" :key="notice.id" class="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-mist/60">
            <span :class="['mt-1 size-2 shrink-0 rounded-full', notice.level === 'warning' ? 'bg-clay' : notice.level === 'success' ? 'bg-emerald-500' : 'bg-blue-400']"></span>
            <span><b class="block text-xs">{{ notice.title }}</b><span class="mt-1 block text-[11px] leading-relaxed text-black/50">{{ notice.message }}</span></span>
          </button>
        </div></Transition>
      </div>
      <button class="ml-1 flex items-center gap-2.5 rounded-xl p-1.5 text-left transition hover:bg-white sm:pr-2.5">
        <span class="grid size-9 place-items-center rounded-xl bg-[#d8e6dc] text-xs font-bold text-forest">민준</span>
        <span class="hidden md:block"><b class="block text-xs">김민준</b><small class="block text-[10px] text-black/40">Product Lab</small></span><ChevronDown :size="14" class="hidden text-black/35 md:block" />
      </button>
    </div>
  </header>
</template>


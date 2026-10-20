<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { LayoutDashboard, CalendarDays, Coins, ContactRound, RadioTower, ChartNoAxesCombined, Cable, Leaf, Settings, CircleHelp, X, PanelLeftClose, PanelLeftOpen } from '@lucide/vue'

defineProps<{ open: boolean; collapsed: boolean }>()
defineEmits<{ close: []; toggleCollapse: [] }>()

const nav = [
  { to: '/', label: '통합 현황', icon: LayoutDashboard },
  { to: '/booking', label: '통합 예약', icon: CalendarDays },
  { to: '/tokens', label: '토큰 관리', icon: Coins },
  { to: '/visitors', label: '방문객 관리', icon: ContactRound },
  { to: '/operations', label: 'IoT 운영', icon: RadioTower },
  { to: '/analytics', label: '데이터 분석', icon: ChartNoAxesCombined },
  { to: '/integrations', label: '연동 관리', icon: Cable },
]
</script>

<template>
  <aside :class="['fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-[#0c1d16] text-white transition-[width,transform] duration-300 lg:translate-x-0', collapsed ? 'lg:w-[84px]' : 'lg:w-[264px]', open ? 'translate-x-0' : '-translate-x-full']">
    <div :class="['flex h-[86px] items-center justify-between', collapsed ? 'px-5 lg:justify-center' : 'px-7']">
      <RouterLink to="/" class="flex items-center gap-3" @click="$emit('close')">
        <span class="grid size-10 place-items-center rounded-[14px] bg-[#c9dfd0] text-[#123e2f]"><Leaf :size="21" :stroke-width="2.2" /></span>
        <span :class="collapsed ? 'lg:hidden' : ''"><b class="block text-[15px] tracking-[.16em]">SEONGSU ONE</b><small class="mt-0.5 block text-[10px] tracking-[.13em] text-white/42">CONNECTED WORKPLACE</small></span>
      </RouterLink>
      <button class="rounded-lg p-1 text-white/50 lg:hidden" aria-label="메뉴 닫기" @click="$emit('close')"><X :size="20" /></button>
    </div>

    <nav class="mt-4 space-y-1 px-4">
      <div :class="['flex h-9 items-center pb-2', collapsed ? 'lg:justify-center' : 'justify-between px-3']">
        <p :class="['text-[10px] font-bold tracking-[.18em] text-white/30', collapsed ? 'lg:hidden' : '']">WORKPLACE</p>
        <button class="hidden size-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/8 hover:text-white lg:flex" :title="collapsed ? '메뉴 펼치기' : '메뉴 접기'" :aria-label="collapsed ? '메뉴 펼치기' : '메뉴 접기'" @click="$emit('toggleCollapse')"><PanelLeftOpen v-if="collapsed" :size="18" /><PanelLeftClose v-else :size="18" /></button>
      </div>
      <RouterLink v-for="item in nav" :key="item.to" :to="item.to" :title="collapsed ? item.label : undefined" :class="['group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium text-white/55 transition hover:bg-white/6 hover:text-white', collapsed ? 'lg:justify-center lg:px-0' : '']" active-class="!bg-white/10 !text-white" @click="$emit('close')">
        <component :is="item.icon" :size="18" :stroke-width="1.8" class="transition group-[.router-link-active]:text-[#bcd8c6]" />
        <span :class="collapsed ? 'lg:hidden' : ''">{{ item.label }}</span>
        <span v-if="item.to === '/operations'" :class="['ml-auto flex items-center gap-1.5 text-[10px] text-emerald-300/80', collapsed ? 'lg:hidden' : '']"><i class="size-1.5 rounded-full bg-emerald-400"></i> LIVE</span>
      </RouterLink>
    </nav>

    <div class="mt-auto px-4 pb-5">
      <div :class="['mb-4 rounded-2xl border border-white/8 bg-white/[.045] p-4', collapsed ? 'lg:hidden' : '']">
        <div class="flex items-center gap-2 text-[11px] font-semibold text-white/75"><span class="relative flex size-2"><span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-50"></span><span class="relative inline-flex size-2 rounded-full bg-emerald-400"></span></span> 시스템 정상 운영</div>
        <p class="mt-2 text-[11px] leading-relaxed text-white/35">마지막 동기화 · 방금 전<br>연결 서비스 4 / 6</p>
      </div>
      <RouterLink to="/settings" :title="collapsed ? '환경 설정' : undefined" :class="['flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12px] text-white/40 transition hover:bg-white/6 hover:text-white/80', collapsed ? 'lg:justify-center lg:px-0' : '']" active-class="!bg-white/10 !text-white" @click="$emit('close')"><Settings :size="17" /><span :class="collapsed ? 'lg:hidden' : ''">환경 설정</span></RouterLink>
      <RouterLink to="/help" :title="collapsed ? '도움말' : undefined" :class="['flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12px] text-white/40 transition hover:bg-white/6 hover:text-white/80', collapsed ? 'lg:justify-center lg:px-0' : '']" active-class="!bg-white/10 !text-white" @click="$emit('close')"><CircleHelp :size="17" /><span :class="collapsed ? 'lg:hidden' : ''">도움말</span></RouterLink>
    </div>
  </aside>
  <Transition name="fade"><button v-if="open" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" aria-label="메뉴 닫기" @click="$emit('close')"></button></Transition>
</template>


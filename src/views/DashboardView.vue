<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarPlus, ArrowUpRight, DoorOpen, UsersRound, Coins, Activity, Clock3, MapPin, CarFront, Coffee, Leaf, AlertTriangle, ChevronRight } from '@lucide/vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const router = useRouter()
const currentDept = computed(() => store.departments.find((item) => item.name === store.currentUser.department))
const resourceMap = computed(() => Object.fromEntries(store.resources.map((item) => [item.id, item])))
const typeIcon = { meeting: DoorOpen, vehicle: CarFront, refresh: Leaf, parking: MapPin, food: Coffee }
const usage = [62, 74, 58, 86, 79, 48, 67]
const days = ['월', '화', '수', '목', '금', '토', '일']
</script>

<template>
  <div class="space-y-6">
    <section class="relative overflow-hidden rounded-[1rem] bg-[#123d2f] px-6 py-7 text-white shadow-[0_22px_50px_rgba(18,61,47,.16)] sm:px-9 sm:py-9">
      <div class="absolute -right-20 -top-32 size-80 rounded-full border-[52px] border-white/[.035]"></div><div class="absolute -bottom-36 right-40 size-72 rounded-full border-[1px] border-white/10"></div>
      <div class="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
        <div><p class="text-[11px] font-bold tracking-[.2em] text-[#b9d4c4]">MONDAY · OCTOBER 20</p><h2 class="mt-4 max-w-xl text-3xl font-medium leading-tight tracking-[-.04em] sm:text-[2.6rem]">좋은 저녁이에요, 민준님.<br><span class="text-white/55">오늘의 공간이 잘 흐르고 있어요.</span></h2><p class="mt-4 text-sm text-white/50">회의 2건과 방문객 1명이 예정되어 있습니다.</p></div>
        <div class="flex flex-wrap gap-3"><button class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-forest transition hover:bg-[#e7f0ea]" @click="router.push('/booking')"><CalendarPlus :size="17" /> 새 예약</button><button class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12" @click="router.push('/visitors')"><UsersRound :size="17" /> 방문객 초대</button></div>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article class="card p-5"><div class="flex items-start justify-between"><span class="grid size-10 place-items-center rounded-xl bg-[#e7f0ea] text-forest"><DoorOpen :size="19" /></span><span class="badge bg-emerald-50 text-emerald-700">+8.4%</span></div><p class="mt-6 text-3xl font-semibold tracking-[-.05em]">{{ store.todayBookings.length }}<small class="ml-1 text-sm font-medium text-black/35">건</small></p><p class="mt-1 text-xs text-black/45">오늘의 예약</p></article>
      <article class="card p-5"><div class="flex items-start justify-between"><span class="grid size-10 place-items-center rounded-xl bg-[#edf0e4] text-[#60704d]"><Activity :size="19" /></span><span class="badge bg-emerald-50 text-emerald-700">정상</span></div><p class="mt-6 text-3xl font-semibold tracking-[-.05em]">{{ store.onlineRate }}<small class="ml-1 text-sm font-medium text-black/35">%</small></p><p class="mt-1 text-xs text-black/45">IoT 장비 온라인</p></article>
      <article class="card p-5"><div class="flex items-start justify-between"><span class="grid size-10 place-items-center rounded-xl bg-[#fbefe5] text-clay"><UsersRound :size="19" /></span><span class="badge bg-orange-50 text-orange-700">{{ store.visitors.filter(v => v.status === 'arrived').length }}명 입실</span></div><p class="mt-6 text-3xl font-semibold tracking-[-.05em]">{{ store.visitors.filter(v => v.visitDate === store.today).length }}<small class="ml-1 text-sm font-medium text-black/35">명</small></p><p class="mt-1 text-xs text-black/45">오늘 방문객</p></article>
      <article class="card p-5"><div class="flex items-start justify-between"><span class="grid size-10 place-items-center rounded-xl bg-[#e9edf5] text-[#4d638c]"><Coins :size="19" /></span><span class="badge bg-blue-50 text-blue-700">이번 달</span></div><p class="mt-6 text-3xl font-semibold tracking-[-.05em]">{{ currentDept?.balance.toLocaleString() }}<small class="ml-1 text-sm font-medium text-black/35">T</small></p><p class="mt-1 text-xs text-black/45">Product Lab 잔여 토큰</p></article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
      <article class="card overflow-hidden">
        <header class="flex items-center justify-between p-6 pb-4"><div><p class="label">TODAY'S FLOW</p><h3 class="mt-2 text-lg font-semibold tracking-[-.03em]">오늘의 일정</h3></div><button class="flex items-center gap-1 text-xs font-semibold text-forest" @click="router.push('/booking')">전체 보기 <ChevronRight :size="15" /></button></header>
        <div class="px-6 pb-6">
          <div v-for="(booking, index) in store.todayBookings" :key="booking.id" class="group flex gap-4 border-b border-black/6 py-4 last:border-0">
            <div class="w-12 shrink-0 pt-1 text-xs font-semibold text-black/50">{{ booking.startTime }}</div>
            <div :class="['w-1 shrink-0 rounded-full', index === 0 ? 'bg-forest' : index === 1 ? 'bg-clay' : 'bg-[#7384a6]']"></div>
            <div class="min-w-0 flex-1"><div class="flex flex-wrap items-center justify-between gap-2"><b class="truncate text-sm">{{ booking.title }}</b><span :class="['badge', booking.status === 'checked-in' ? 'bg-emerald-50 text-emerald-700' : 'bg-black/[.04] text-black/55']">{{ booking.status === 'checked-in' ? '이용 중' : '예약 확정' }}</span></div><div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-black/42"><span class="flex items-center gap-1"><MapPin :size="12" />{{ resourceMap[booking.resourceId]?.name }} · {{ resourceMap[booking.resourceId]?.floor }}</span><span class="flex items-center gap-1"><Clock3 :size="12" />{{ booking.startTime }}–{{ booking.endTime }}</span><span class="flex items-center gap-1"><UsersRound :size="12" />{{ booking.attendees }}명</span></div></div>
          </div>
        </div>
      </article>

      <article class="card p-6">
        <div class="flex items-center justify-between"><div><p class="label">SPACE PULSE</p><h3 class="mt-2 text-lg font-semibold tracking-[-.03em]">주간 공간 활용도</h3></div><button class="grid size-9 place-items-center rounded-xl border border-black/8" @click="router.push('/analytics')"><ArrowUpRight :size="17" /></button></div>
        <div class="mt-7 flex h-44 items-end justify-between gap-3 border-b border-black/6 px-1">
          <div v-for="(value, i) in usage" :key="days[i]" class="group flex h-full flex-1 flex-col items-center justify-end gap-2"><span class="text-[10px] font-semibold text-black/0 transition group-hover:text-black/45">{{ value }}%</span><div :class="['w-full max-w-8 rounded-t-lg transition-all duration-500', i === 3 ? 'bg-forest' : 'bg-[#cfdbd2] group-hover:bg-[#9eb6a7]']" :style="{ height: `${value}%` }"></div></div>
        </div><div class="mt-3 flex justify-between px-1"><span v-for="day in days" :key="day" class="flex-1 text-center text-[10px] font-semibold text-black/35">{{ day }}</span></div>
        <div class="mt-6 flex items-center justify-between rounded-2xl bg-mist/70 p-4"><div><p class="text-[11px] text-black/45">평균 활용도</p><b class="mt-1 block text-xl">68.2%</b></div><div class="text-right"><p class="text-[11px] text-black/45">지난주 대비</p><b class="mt-1 block text-sm text-emerald-700">+4.7% ↗</b></div></div>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <article class="card p-6"><div class="flex items-center justify-between"><div><p class="label">LIVE AVAILABILITY</p><h3 class="mt-2 text-lg font-semibold tracking-[-.03em]">지금 이용 가능한 공간</h3></div><span class="flex items-center gap-2 text-[11px] font-semibold text-emerald-700"><i class="size-2 rounded-full bg-emerald-500"></i> 실시간</span></div><div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><button v-for="resource in store.resources.filter(r => r.status === 'available').slice(0, 3)" :key="resource.id" class="rounded-2xl border border-black/7 p-4 text-left transition hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-lg" @click="router.push('/booking')"><div class="flex items-center justify-between"><span class="grid size-9 place-items-center rounded-xl bg-mist text-forest"><component :is="typeIcon[resource.type]" :size="17" /></span><ArrowUpRight :size="15" class="text-black/25" /></div><b class="mt-4 block text-sm">{{ resource.name }}</b><p class="mt-1 text-[11px] text-black/42">{{ resource.floor }} · 최대 {{ resource.capacity }}명</p><div class="mt-3 flex items-center justify-between"><span class="text-[10px] text-emerald-700">바로 예약 가능</span><span class="text-[10px] font-semibold">{{ resource.tokenCost }}T / 시간</span></div></button></div></article>
      <article class="card p-6"><div class="flex items-center justify-between"><div><p class="label">OPERATION NOTICE</p><h3 class="mt-2 text-lg font-semibold tracking-[-.03em]">운영 알림</h3></div><span class="badge bg-orange-50 text-orange-700">{{ store.unreadNotices }} new</span></div><div class="mt-5 space-y-3"><div v-for="notice in store.notices.slice(0, 2)" :key="notice.id" class="flex gap-3 rounded-2xl bg-[#f7f6f1] p-4"><span :class="['grid size-8 shrink-0 place-items-center rounded-lg', notice.level === 'warning' ? 'bg-orange-100 text-clay' : 'bg-blue-100 text-blue-600']"><AlertTriangle v-if="notice.level === 'warning'" :size="16" /><Activity v-else :size="16" /></span><div><b class="text-xs">{{ notice.title }}</b><p class="mt-1 text-[11px] leading-relaxed text-black/45">{{ notice.message }}</p></div></div></div></article>
    </section>
  </div>
</template>


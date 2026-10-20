<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Search, SlidersHorizontal, MapPin, UsersRound, Coins, Plus, CalendarDays, X, Check, CarFront, DoorOpen, Leaf, ParkingCircle, Coffee } from '@lucide/vue'
import UiModal from '../components/UiModal.vue'
import { useAppStore } from '../stores/app'
import type { Resource, ResourceType } from '../types'

const store = useAppStore()
const activeType = ref<'all' | ResourceType>('all')
const query = ref('')
const selected = ref<Resource | null>(null)
const error = ref('')
const tabs: { key: 'all' | ResourceType; label: string; icon: unknown }[] = [
  { key: 'all', label: '전체', icon: SlidersHorizontal }, { key: 'meeting', label: '회의실', icon: DoorOpen }, { key: 'vehicle', label: '업무차량', icon: CarFront },
  { key: 'refresh', label: '리프레시룸', icon: Leaf }, { key: 'parking', label: '주차', icon: ParkingCircle }, { key: 'food', label: '식음료', icon: Coffee },
]
const typeLabel = { meeting: '회의실', vehicle: '업무차량', refresh: '리프레시룸', parking: '주차', food: '식음료' }
const form = reactive({ title: '', date: new Date().toISOString().slice(0, 10), startTime: '10:00', endTime: '11:00', attendees: 2 })
const filtered = computed(() => store.resources.filter((item) => (activeType.value === 'all' || item.type === activeType.value) && item.name.toLowerCase().includes(query.value.toLowerCase())))
const upcoming = computed(() => store.bookings.filter((item) => item.status !== 'cancelled').sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)))
const resourceMap = computed(() => Object.fromEntries(store.resources.map((item) => [item.id, item])))

function openBooking(resource: Resource) {
  if (resource.status === 'maintenance') return
  selected.value = resource
  form.title = `${resource.name} 이용`
  form.attendees = Math.min(2, resource.capacity)
  error.value = ''
}
async function submit() {
  if (!selected.value || !form.title || !form.date || form.startTime >= form.endTime) { error.value = '예약명과 올바른 이용 시간을 입력해 주세요.'; return }
  try {
    await store.createBooking({ resourceId: selected.value.id, title: form.title, userName: store.currentUser.name, department: store.currentUser.department, date: form.date, startTime: form.startTime, endTime: form.endTime, attendees: form.attendees, tokenCost: selected.value.tokenCost })
    selected.value = null
  } catch (e) { error.value = e instanceof Error ? e.message : '예약 중 오류가 발생했습니다.' }
}
</script>

<template>
  <div class="space-y-6">
    <section class="flex flex-col justify-between gap-4 rounded-[1rem] bg-[#e5ece6] p-6 sm:flex-row sm:items-center sm:p-8"><div><p class="label text-forest/60">ONE PLACE, ONE BOOKING</p><h2 class="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">필요한 공간과 서비스를 한 번에.</h2><p class="mt-2 text-sm text-black/45">예약부터 입실, 반납, 토큰 정산까지 자동으로 연결됩니다.</p></div><button class="btn-primary shrink-0" @click="selected = store.resources.find(r => r.status === 'available') ?? null"><Plus :size="17" /> 빠른 예약</button></section>
    <section class="card p-4 sm:p-5"><div class="flex flex-col gap-4 xl:flex-row xl:items-center"><label class="flex flex-1 items-center gap-2 rounded-xl bg-[#f3f4f1] px-3.5 py-3"><Search :size="17" class="text-black/35" /><input v-model="query" class="w-full bg-transparent text-sm outline-none placeholder:text-black/30" placeholder="공간 또는 서비스 이름 검색" /></label><div class="flex gap-2 overflow-x-auto pb-1 xl:pb-0"><button v-for="tab in tabs" :key="tab.key" :class="['flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition', activeType === tab.key ? 'bg-forest text-white' : 'bg-[#f3f4f1] text-black/50 hover:text-black']" @click="activeType = tab.key"><component :is="tab.icon" :size="15" />{{ tab.label }}</button></div></div></section>

    <section><div class="mb-4 flex items-end justify-between"><div><p class="label">AVAILABLE RESOURCES</p><h3 class="mt-1 text-lg font-semibold">예약 자원 <span class="text-black/30">{{ filtered.length }}</span></h3></div><span class="text-[11px] text-black/40">요금은 기본 이용 단위 기준</span></div><div class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      <article v-for="resource in filtered" :key="resource.id" class="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(13,35,26,.09)]">
        <div class="relative h-28 overflow-hidden" :style="{ background: resource.image }"><div class="absolute inset-0 opacity-25" style="background-image:radial-gradient(circle at 75% 15%,white 0,transparent 30%),linear-gradient(120deg,transparent 45%,white 46%,transparent 47%)"></div><span :class="['badge absolute right-4 top-4 backdrop-blur-md', resource.status === 'available' ? 'bg-white/85 text-emerald-800' : resource.status === 'occupied' ? 'bg-[#10251d]/80 text-white' : 'bg-orange-50/90 text-orange-700']"><i :class="['size-1.5 rounded-full', resource.status === 'available' ? 'bg-emerald-500' : resource.status === 'occupied' ? 'bg-amber-300' : 'bg-orange-500']"></i>{{ resource.status === 'available' ? '이용 가능' : resource.status === 'occupied' ? '사용 중' : '점검 중' }}</span><span class="absolute bottom-4 left-4 rounded-lg bg-black/25 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur">{{ typeLabel[resource.type] }}</span></div>
        <div class="p-5"><div class="flex items-start justify-between gap-3"><div><h4 class="text-base font-semibold">{{ resource.name }}</h4><p class="mt-1.5 flex items-center gap-3 text-[11px] text-black/42"><span class="flex items-center gap-1"><MapPin :size="12" />{{ resource.floor }}</span><span class="flex items-center gap-1"><UsersRound :size="12" />최대 {{ resource.capacity }}명</span></p></div><span class="flex items-center gap-1 rounded-lg bg-[#f1f3ef] px-2.5 py-1.5 text-xs font-semibold"><Coins :size="13" class="text-clay" />{{ resource.tokenCost }}T</span></div><div class="mt-4 flex flex-wrap gap-1.5"><span v-for="feature in resource.features" :key="feature" class="rounded-lg bg-[#f6f6f2] px-2 py-1 text-[10px] text-black/50">{{ feature }}</span></div><button class="btn-secondary mt-5 w-full group-hover:border-forest/30 group-hover:text-forest" :disabled="resource.status === 'maintenance'" @click="openBooking(resource)">{{ resource.status === 'maintenance' ? '점검 완료 후 예약 가능' : '일정 확인 및 예약' }}</button></div>
      </article>
    </div></section>

    <section class="card p-6"><div class="flex items-center justify-between"><div><p class="label">MY SCHEDULE</p><h3 class="mt-1 text-lg font-semibold">다가오는 예약</h3></div><CalendarDays :size="20" class="text-black/30" /></div><div class="mt-5 divide-y divide-black/6"><div v-for="booking in upcoming.slice(0, 5)" :key="booking.id" class="flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"><div class="flex items-center gap-4"><div class="grid size-12 shrink-0 place-items-center rounded-xl bg-mist text-center"><b class="text-xs">{{ booking.date.slice(5).replace('-', '.') }}</b></div><div><b class="text-sm">{{ booking.title }}</b><p class="mt-1 text-[11px] text-black/42">{{ resourceMap[booking.resourceId]?.name }} · {{ booking.startTime }}–{{ booking.endTime }} · {{ booking.department }}</p></div></div><div class="flex items-center gap-3 pl-16 sm:pl-0"><span class="badge bg-emerald-50 text-emerald-700">예약 확정</span><button class="grid size-8 place-items-center rounded-lg text-black/30 hover:bg-red-50 hover:text-red-600" title="예약 취소" @click="store.cancelBooking(booking.id)"><X :size="16" /></button></div></div></div></section>

    <UiModal v-if="selected" title="새 예약" :description="`${selected.name} · ${selected.floor}`" @close="selected = null">
      <form class="space-y-5" @submit.prevent="submit"><div class="rounded-2xl bg-[#e7eee8] p-4"><div class="flex items-center justify-between"><div><p class="text-xs text-black/45">이용 요금</p><b class="mt-1 block text-xl">{{ selected.tokenCost }} 토큰</b></div><span class="grid size-10 place-items-center rounded-xl bg-white text-forest"><Coins :size="19" /></span></div></div><label class="block"><span class="label mb-2 block">예약명</span><input v-model="form.title" class="field" /></label><div class="grid gap-4 sm:grid-cols-2"><label><span class="label mb-2 block">이용 날짜</span><input v-model="form.date" type="date" class="field" /></label><label><span class="label mb-2 block">이용 인원</span><input v-model.number="form.attendees" type="number" min="1" :max="selected.capacity" class="field" /></label></div><div class="grid grid-cols-2 gap-4"><label><span class="label mb-2 block">시작</span><input v-model="form.startTime" type="time" class="field" /></label><label><span class="label mb-2 block">종료</span><input v-model="form.endTime" type="time" class="field" /></label></div><p v-if="error" class="rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700">{{ error }}</p><div class="flex gap-3 pt-1"><button type="button" class="btn-secondary flex-1" @click="selected = null">취소</button><button class="btn-primary flex-1"><Check :size="16" /> 예약 확정</button></div></form>
    </UiModal>
  </div>
</template>

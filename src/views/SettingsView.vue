<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Sun, Moon, Bell, CalendarClock, Database, Download, Save, ShieldCheck, HardDrive, Check } from '@lucide/vue'
import { useThemeStore } from '../stores/theme'
import { useAppStore } from '../stores/app'

const theme = useThemeStore()
const store = useAppStore()

const defaults = {
  browserNotifications: true,
  bookingReminders: true,
  operationAlerts: true,
  reminderMinutes: 10,
  noShowMinutes: 10,
  autoReturn: true,
}

const saved = localStorage.getItem('seongsu-one-preferences')
const preferences = reactive({ ...defaults, ...(saved ? JSON.parse(saved) : {}) })
const recordCount = computed(() => store.resources.length + store.bookings.length + store.departments.length + store.transactions.length + store.visitors.length + store.integrations.length + store.devices.length + store.notices.length)

function savePreferences() {
  localStorage.setItem('seongsu-one-preferences', JSON.stringify(preferences))
  store.notify('환경설정을 저장했습니다.')
}

function exportLocalData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 'ver01',
    resources: store.resources,
    bookings: store.bookings,
    departments: store.departments,
    tokenTransactions: store.transactions,
    visitors: store.visitors,
    integrations: store.integrations,
    devices: store.devices,
    notices: store.notices,
  }
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `seongsu-one-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
  store.notify('로컬 데이터 백업 파일을 만들었습니다.')
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-[1rem] bg-[#dfeae3] p-7 sm:p-9">
      <p class="label text-forest/60">MY WORKPLACE</p>
      <h2 class="mt-3 text-3xl font-semibold tracking-[-.045em]">나에게 맞는 업무 환경을 설정하세요.</h2>
      <p class="mt-3 max-w-2xl text-sm text-black/45">테마와 알림, 예약 자동화 기본값은 이 브라우저에 안전하게 저장됩니다.</p>
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <article class="card p-6 sm:p-7">
        <div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-xl bg-mist text-forest"><Sun :size="18" /></span><div><p class="label">APPEARANCE</p><h3 class="mt-1 text-lg font-semibold">화면 테마</h3></div></div>
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button :class="['relative rounded-2xl border p-4 text-left transition', !theme.isDark ? 'border-forest bg-[#edf4ef] ring-2 ring-forest/10' : 'border-black/8 bg-white hover:border-black/20']" @click="theme.setMode('light')">
            <span class="grid h-24 place-items-center rounded-xl bg-[#f2f3ef] text-forest"><Sun :size="26" /></span><b class="mt-3 block text-sm">라이트</b><p class="mt-1 text-[10px] text-black/40">밝고 선명한 기본 화면</p><span v-if="!theme.isDark" class="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-forest text-white"><Check :size="12" /></span>
          </button>
          <button :class="['relative rounded-2xl border p-4 text-left transition', theme.isDark ? 'border-emerald-500/60 bg-[#10231b] ring-2 ring-emerald-400/10' : 'border-black/8 bg-white hover:border-black/20']" @click="theme.setMode('dark')">
            <span class="grid h-24 place-items-center rounded-xl bg-[#0b1511] text-[#b9d4c4]"><Moon :size="25" /></span><b class="mt-3 block text-sm">다크</b><p class="mt-1 text-[10px] text-black/40">눈부심을 줄인 저조도 화면</p><span v-if="theme.isDark" class="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-emerald-600 text-white"><Check :size="12" /></span>
          </button>
        </div>
      </article>

      <article class="card p-6 sm:p-7">
        <div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-xl bg-orange-50 text-clay"><Bell :size="18" /></span><div><p class="label">NOTIFICATIONS</p><h3 class="mt-1 text-lg font-semibold">알림 설정</h3></div></div>
        <div class="mt-6 divide-y divide-black/6">
          <label v-for="item in [{key:'browserNotifications',title:'브라우저 알림',desc:'예약과 방문객 상태 변경을 알려줍니다.'},{key:'bookingReminders',title:'예약 시작 알림',desc:'입실 확인이 필요한 시간을 미리 알려줍니다.'},{key:'operationAlerts',title:'IoT 운영 장애 알림',desc:'장비 오프라인과 임계치 초과를 알려줍니다.'}]" :key="item.key" class="relative flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0">
            <span><b class="text-xs">{{ item.title }}</b><span class="mt-1 block text-[10px] text-black/42">{{ item.desc }}</span></span>
            <input v-model="preferences[item.key as keyof typeof preferences]" type="checkbox" class="peer absolute h-0 w-0 opacity-0" /><span class="relative h-6 w-11 shrink-0 rounded-full bg-black/10 transition after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-forest peer-checked:after:translate-x-5"></span>
          </label>
        </div>
      </article>

      <article class="card p-6 sm:p-7">
        <div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><CalendarClock :size="18" /></span><div><p class="label">BOOKING DEFAULTS</p><h3 class="mt-1 text-lg font-semibold">예약 자동화</h3></div></div>
        <div class="mt-6 space-y-5"><label class="block"><span class="mb-2 flex justify-between text-xs"><b>시작 전 알림</b><span class="text-black/40">{{ preferences.reminderMinutes }}분 전</span></span><input v-model.number="preferences.reminderMinutes" type="range" min="5" max="30" step="5" class="w-full accent-[#174d3b]" /></label><label class="block"><span class="mb-2 flex justify-between text-xs"><b>미입실 자동 취소</b><span class="text-black/40">시작 후 {{ preferences.noShowMinutes }}분</span></span><input v-model.number="preferences.noShowMinutes" type="range" min="5" max="30" step="5" class="w-full accent-[#174d3b]" /></label><label class="relative flex items-center justify-between rounded-2xl bg-[#f5f6f2] p-4"><span><b class="text-xs">종료 후 자동 반납</b><span class="mt-1 block text-[10px] text-black/42">예약 종료 시 공간과 장비를 자동 해제합니다.</span></span><input v-model="preferences.autoReturn" type="checkbox" class="peer absolute h-0 w-0 opacity-0" /><span class="relative h-6 w-11 shrink-0 rounded-full bg-black/10 transition after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-forest peer-checked:after:translate-x-5"></span></label></div>
      </article>

      <article class="card p-6 sm:p-7">
        <div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-xl bg-[#e9edf5] text-[#526e9e]"><Database :size="18" /></span><div><p class="label">LOCAL DATABASE</p><h3 class="mt-1 text-lg font-semibold">로컬 데이터</h3></div></div>
        <div class="mt-6 grid grid-cols-2 gap-3"><div class="rounded-2xl bg-[#f5f6f2] p-4"><HardDrive :size="17" class="text-forest" /><b class="mt-3 block text-xl">{{ recordCount }}</b><p class="mt-1 text-[10px] text-black/40">IndexedDB 레코드</p></div><div class="rounded-2xl bg-[#f5f6f2] p-4"><ShieldCheck :size="17" class="text-forest" /><b class="mt-3 block text-xl">로컬</b><p class="mt-1 text-[10px] text-black/40">현재 저장 위치</p></div></div><p class="mt-4 text-[11px] leading-relaxed text-black/45">데이터는 현재 브라우저 프로필에만 저장됩니다. 운영 전환 시 PostgreSQL과 서버 권한 관리로 이전합니다.</p><button class="btn-secondary mt-5 w-full" @click="exportLocalData"><Download :size="15" /> JSON 백업 내보내기</button>
      </article>
    </section>

    <div class="sticky bottom-5 flex justify-end"><button class="btn-primary shadow-xl" @click="savePreferences"><Save :size="16" /> 설정 저장</button></div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CalendarPlus, Coins, UserPlus, RadioTower, ChevronRight, BookOpen, CircleHelp, LifeBuoy, Search, ExternalLink } from '@lucide/vue'

const guides = [
  { to: '/booking', icon: CalendarPlus, title: '공간·서비스 예약', description: '회의실부터 차량, 리프레시룸까지 검색하고 예약합니다.', color: 'bg-emerald-50 text-emerald-700' },
  { to: '/tokens', icon: Coins, title: '토큰 이용·관리', description: '부서별 잔액, 차감과 환불, 거래 원장을 확인합니다.', color: 'bg-orange-50 text-clay' },
  { to: '/visitors', icon: UserPlus, title: '방문객 초대', description: '방문 정보를 등록하고 QR 출입증을 발급합니다.', color: 'bg-blue-50 text-blue-600' },
  { to: '/operations', icon: RadioTower, title: 'IoT 운영 확인', description: '장비 상태와 운영 알림, 자동화 규칙을 점검합니다.', color: 'bg-purple-50 text-purple-600' },
]

const faqs = [
  { question: '예약했는데 토큰은 언제 차감되나요?', answer: '예약 확정과 동시에 부서 지갑에서 차감됩니다. 정상 취소 시 동일 지갑으로 자동 환불되며 모든 변경은 거래 원장에 기록됩니다.' },
  { question: '회의실 입실 확인은 어떻게 하나요?', answer: '운영 환경에서는 사원증·모바일 QR·재실 센서 중 고객 정책에 맞는 방식을 사용합니다. 시작 후 설정된 유예시간 안에 입실이 확인되지 않으면 알림 후 자동 취소할 수 있습니다.' },
  { question: '방문객 QR을 다시 확인할 수 있나요?', answer: '방문객 관리에서 대상 방문객의 QR 버튼을 선택하면 유효한 방문 코드를 다시 확인할 수 있습니다.' },
  { question: '데이터가 다른 PC에서도 보이나요?', answer: 'ver01은 현재 브라우저의 IndexedDB에 저장되므로 기기 간 동기화되지 않습니다. 향후 PostgreSQL 기반 서버로 전환하면 계정 권한에 따라 여러 기기에서 동일 데이터를 사용할 수 있습니다.' },
  { question: '장비가 오프라인으로 표시되면 어떻게 하나요?', answer: 'IoT 운영 화면에서 마지막 응답 시각과 대상 공간을 확인한 뒤 전원, 네트워크, 현장 게이트웨이 순서로 점검합니다. 운영 버전에서는 ITSM 장애 티켓과 연동할 예정입니다.' },
]

const query = ref('')
const normalizedQuery = computed(() => query.value.trim().toLowerCase())
const filteredGuides = computed(() => !normalizedQuery.value ? guides : guides.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery.value)))
const filteredFaqs = computed(() => !normalizedQuery.value ? faqs : faqs.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(normalizedQuery.value)))
</script>

<template>
  <div class="space-y-6">
    <section class="relative overflow-hidden rounded-[1rem] bg-[#123d2f] p-7 text-white sm:p-9">
      <div class="absolute -right-12 -top-20 size-64 rounded-full border-[42px] border-white/[.04]"></div>
      <div class="relative max-w-2xl">
        <p class="text-[10px] font-bold tracking-[.18em] text-[#b9d4c4]">HOW CAN WE HELP?</p>
        <h2 class="mt-3 text-3xl font-medium tracking-[-.04em]">무엇을 도와드릴까요?</h2>
        <p class="mt-3 text-sm text-white/50">주요 기능의 사용법과 자주 묻는 질문을 빠르게 찾아보세요.</p>
        <label class="mt-6 flex max-w-lg items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink"><Search :size="17" class="text-black/35" /><input v-model="query" class="w-full bg-transparent text-sm outline-none" placeholder="도움말 검색" /></label>
      </div>
    </section>

    <section v-if="filteredGuides.length">
      <div class="mb-4"><p class="label">QUICK START</p><h3 class="mt-2 text-lg font-semibold">기능별 시작하기</h3></div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RouterLink v-for="guide in filteredGuides" :key="guide.to" :to="guide.to" class="card group p-5 transition hover:-translate-y-1 hover:shadow-lg">
          <div class="flex items-start justify-between"><span :class="['grid size-10 place-items-center rounded-xl', guide.color]"><component :is="guide.icon" :size="18" /></span><ChevronRight :size="16" class="text-black/20 transition group-hover:translate-x-1 group-hover:text-forest" /></div>
          <b class="mt-5 block text-sm">{{ guide.title }}</b><p class="mt-2 text-[11px] leading-relaxed text-black/45">{{ guide.description }}</p>
        </RouterLink>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <article class="card p-6 sm:p-7">
        <div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-xl bg-mist text-forest"><CircleHelp :size="18" /></span><div><p class="label">FREQUENTLY ASKED</p><h3 class="mt-1 text-lg font-semibold">자주 묻는 질문</h3></div></div>
        <div class="mt-6 divide-y divide-black/6">
          <details v-for="(faq, i) in filteredFaqs" :key="faq.question" :open="i === 0" class="group py-4 first:pt-0"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold"><span>{{ faq.question }}</span><span class="grid size-7 shrink-0 place-items-center rounded-full bg-black/5 text-black/40 transition group-open:rotate-90"><ChevronRight :size="14" /></span></summary><p class="mt-3 pr-10 text-[11px] leading-6 text-black/48">{{ faq.answer }}</p></details>
          <p v-if="!filteredFaqs.length" class="py-8 text-center text-xs text-black/40">검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p>
        </div>
      </article>
      <div class="space-y-6">
        <article class="card p-6"><span class="grid size-11 place-items-center rounded-xl bg-[#e9edf5] text-[#526e9e]"><BookOpen :size="20" /></span><h3 class="mt-5 text-base font-semibold">운영 문서</h3><p class="mt-2 text-[11px] leading-relaxed text-black/45">외부 연동 가정, PostgreSQL 전환 구조와 고객 확인 항목은 프로젝트 문서에 정리되어 있습니다.</p><div class="mt-5 space-y-2"><div class="flex items-center justify-between rounded-xl bg-[#f5f6f2] px-3.5 py-3 text-xs"><span>기술 조사 및 가정</span><ExternalLink :size="13" class="text-black/30" /></div><div class="flex items-center justify-between rounded-xl bg-[#f5f6f2] px-3.5 py-3 text-xs"><span>PostgreSQL 전환안</span><ExternalLink :size="13" class="text-black/30" /></div></div></article>
        <article class="card border-forest/15 bg-[#e8f0eb] p-6"><span class="grid size-11 place-items-center rounded-xl bg-white text-forest"><LifeBuoy :size="20" /></span><h3 class="mt-5 text-base font-semibold">문제가 해결되지 않았나요?</h3><p class="mt-2 text-[11px] leading-relaxed text-black/45">운영 알림의 발생 시각, 장비명, 화면 캡처를 준비하면 더 빠르게 원인을 확인할 수 있습니다.</p><button class="btn-primary mt-5 w-full" disabled>지원 채널 준비 중</button></article>
      </div>
    </section>
  </div>
</template>

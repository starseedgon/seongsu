<script setup lang="ts">
import { reactive, ref } from 'vue'
import kolonLogo from '../assets/kolon-logo-white.svg'
import { Eye, EyeOff, LockKeyhole, Moon, ShieldCheck, Sun, UserRound } from '@lucide/vue'
import { DEFAULT_ACCOUNT, useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const auth = useAuthStore()
const theme = useThemeStore()
const showPassword = ref(false)
const error = ref('')
const form = reactive({
  accountId: DEFAULT_ACCOUNT.id,
  password: DEFAULT_ACCOUNT.password,
})

function submit() {
  error.value = ''
  if (!form.accountId.trim()) {
    error.value = '계정 아이디를 입력해 주세요.'
    return
  }

  if (!auth.login(form.accountId, form.password)) {
    error.value = '등록된 계정 아이디를 확인해 주세요.'
  }
}
</script>

<template>
  <main class="relative grid min-h-screen overflow-hidden bg-[#eef1ec] px-5 py-8 dark:bg-[#0b1511] sm:px-8 lg:grid-cols-[minmax(360px,0.86fr)_minmax(520px,1.14fr)] lg:p-0">
    <section class="relative hidden overflow-hidden bg-[#0c1d16] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
      <div class="absolute -right-32 -top-28 size-96 rounded-full border border-white/8"></div>
      <div class="absolute -bottom-48 -left-32 size-[34rem] rounded-full border border-white/7"></div>
      <div class="absolute bottom-[18%] right-[12%] size-44 rounded-full bg-emerald-300/5 blur-2xl"></div>

      <div class="relative flex items-center gap-3">
        <img :src="kolonLogo" alt="KOLON INDUSTRIES FnC ORGANIZATION" class="h-auto w-[280px]" width="461" height="72" />
      </div>

      <div class="relative max-w-xl">
        <p class="text-[11px] font-bold tracking-[.2em] text-emerald-200/55">SMART WORKPLACE OS</p>
        <h1 class="mt-5 text-4xl font-semibold leading-[1.22] tracking-[-.045em] xl:text-5xl">공간과 사람,<br>운영을 하나로 연결합니다.</h1>
        <p class="mt-6 max-w-md text-sm leading-7 text-white/48">성수 신사옥의 예약, 방문객, 토큰과 IoT 설비를 한 곳에서 관리하는 통합 워크플레이스입니다.</p>
        <div class="mt-10 flex items-center gap-3 text-xs text-white/55"><ShieldCheck :size="18" class="text-emerald-200/65" /> 사내 사용자 전용 서비스</div>
      </div>

      <p class="relative text-[10px] tracking-[.12em] text-white/25">SEONGSU CAMPUS · WORKPLACE OPERATIONS</p>
    </section>

    <section class="relative flex items-center justify-center py-8 lg:py-16">
      <button class="theme-toggle absolute right-0 top-0 grid size-10 place-items-center rounded-lg border border-black/8 bg-white text-black/55 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#17261f] dark:text-white/70 sm:right-2 sm:top-2 lg:right-10 lg:top-10" :aria-label="theme.isDark ? '라이트 모드로 전환' : '다크 모드로 전환'" @click="theme.toggle()">
        <Sun v-if="theme.isDark" :size="18" />
        <Moon v-else :size="18" />
      </button>

      <div class="w-full max-w-[440px]">
        <div class="mb-10 flex items-center gap-3 lg:hidden">
          <img :src="kolonLogo" alt="KOLON INDUSTRIES FnC ORGANIZATION" class="h-auto w-[250px] brightness-0 dark:brightness-100" width="461" height="72" />
        </div>

        <p class="label">WELCOME BACK</p>
        <h2 class="mt-3 text-3xl font-semibold tracking-[-.045em]">로그인</h2>
        <p class="mt-3 text-sm leading-6 text-black/45">워크플레이스 운영을 계속하려면 계정으로 로그인해 주세요.</p>

        <form class="mt-9 space-y-5" @submit.prevent="submit">
          <label class="block">
            <span class="mb-2 block text-xs font-semibold">계정 아이디</span>
            <span class="relative block">
              <UserRound :size="17" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
              <input v-model="form.accountId" class="field login-field h-12" autocomplete="username" autofocus aria-label="계정 아이디" />
            </span>
          </label>

          <label class="block">
            <span class="mb-2 block text-xs font-semibold">비밀번호</span>
            <span class="relative block">
              <LockKeyhole :size="17" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
              <input v-model="form.password" class="field login-field login-password-field h-12" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" aria-label="비밀번호" />
              <button type="button" class="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center text-black/35 transition hover:text-black/70" :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" :size="17" />
                <Eye v-else :size="17" />
              </button>
            </span>
          </label>

          <p v-if="error" role="alert" class="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700 dark:border-red-400/15 dark:bg-red-400/8 dark:text-red-300">{{ error }}</p>

          <button type="submit" class="btn-primary h-12 w-full">로그인</button>
        </form>

        <div class="mt-6 rounded-lg border border-black/7 bg-white/55 px-4 py-3 text-[11px] leading-5 text-black/42 dark:border-white/8 dark:bg-white/[.035]">
          현재 프로토타입에서는 비밀번호 유효성 검사를 하지 않습니다.
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-field {
  padding-left: 2.75rem;
}

.login-password-field {
  padding-right: 2.75rem;
}
</style>

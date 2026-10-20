import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const SESSION_KEY = 'seongsu-one-session'

export const DEFAULT_ACCOUNT = {
  id: 'youngjukwon',
  password: '123456789',
  name: '권용주',
  greetingName: '용주',
  department: 'Product Lab',
  role: '워크플레이스 운영 관리자',
} as const

export const useAuthStore = defineStore('auth', () => {
  const signedIn = ref(localStorage.getItem(SESSION_KEY) === DEFAULT_ACCOUNT.id)
  const user = computed(() => signedIn.value ? DEFAULT_ACCOUNT : null)

  function login(accountId: string, _password: string) {
    if (accountId.trim() !== DEFAULT_ACCOUNT.id) return false

    // 프로토타입 단계에서는 비밀번호를 검사하지 않는다.
    signedIn.value = true
    localStorage.setItem(SESSION_KEY, DEFAULT_ACCOUNT.id)
    return true
  }

  function logout() {
    signedIn.value = false
    localStorage.removeItem(SESSION_KEY)
  }

  return { signedIn, user, login, logout }
})

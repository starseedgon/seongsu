<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { CheckCircle2 } from '@lucide/vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import LoginView from './views/LoginView.vue'
import { useAppStore } from './stores/app'
import { useAuthStore } from './stores/auth'

const store = useAppStore()
const auth = useAuthStore()
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(localStorage.getItem('seongsu-one-sidebar') === 'collapsed')
let dataLoaded = false

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('seongsu-one-sidebar', sidebarCollapsed.value ? 'collapsed' : 'expanded')
}
async function loadWorkspace() {
  if (dataLoaded || !auth.signedIn) return
  dataLoaded = true
  await store.load()
}

watch(() => auth.signedIn, loadWorkspace)
onMounted(loadWorkspace)
</script>

<template>
  <LoginView v-if="!auth.signedIn" />
  <div v-else class="min-h-screen bg-[#f2f3ef]">
    <AppSidebar :open="sidebarOpen" :collapsed="sidebarCollapsed" @close="sidebarOpen = false" @toggle-collapse="toggleSidebar" />
    <div :class="['transition-[padding] duration-300', sidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[264px]']">
      <AppTopbar @menu="sidebarOpen = true" />
      <main class="mx-auto min-h-[calc(100vh-86px)] max-w-[1560px] p-5 sm:p-8 lg:p-10">
        <div v-if="store.loading" class="grid min-h-[50vh] place-items-center"><div class="text-center"><div class="mx-auto size-8 animate-spin rounded-full border-2 border-forest/15 border-t-forest"></div><p class="mt-4 text-xs font-medium text-black/45">워크플레이스를 준비하고 있습니다</p></div></div>
        <RouterView v-else />
      </main>
    </div>
    <Transition name="fade"><div v-if="store.toast" class="fixed bottom-5 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-[#10241b] px-4 py-3 text-xs font-semibold text-white shadow-2xl"><CheckCircle2 :size="17" class="text-emerald-300" />{{ store.toast }}</div></Transition>
  </div>
</template>

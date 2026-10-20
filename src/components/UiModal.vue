<script setup lang="ts">
import { X } from '@lucide/vue'
defineProps<{ title: string; description?: string; wide?: boolean }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div class="fixed inset-0 z-[100] flex items-end justify-center bg-[#08130e]/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-5" @mousedown.self="$emit('close')">
        <section :class="['max-h-[92vh] w-full overflow-auto rounded-t-[1rem] bg-[#f7f7f3] shadow-2xl sm:rounded-[1rem]', wide ? 'max-w-3xl' : 'max-w-lg']">
          <header class="sticky top-0 z-10 flex items-start justify-between border-b border-black/6 bg-[#f7f7f3]/95 px-6 py-5 backdrop-blur sm:px-7">
            <div><h2 class="text-lg font-semibold tracking-[-.025em]">{{ title }}</h2><p v-if="description" class="mt-1 text-xs text-black/45">{{ description }}</p></div>
            <button class="grid size-9 place-items-center rounded-full bg-black/5 text-black/45 hover:bg-black/10" aria-label="닫기" @click="$emit('close')"><X :size="18" /></button>
          </header>
          <div class="p-6 sm:p-7"><slot /></div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>


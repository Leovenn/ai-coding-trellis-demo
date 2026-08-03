<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useMotionController } from '@/composables/useMotionController'

const props = defineProps<{
  trigger: number
}>()

const { reduced } = useMotionController()
const visible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | undefined

const pieces = [
  { left: '8%', color: '#315ee7', delay: '0ms', rotate: '18deg' },
  { left: '20%', color: '#d99b35', delay: '80ms', rotate: '-24deg' },
  { left: '34%', color: '#df6c55', delay: '20ms', rotate: '32deg' },
  { left: '48%', color: '#315ee7', delay: '110ms', rotate: '-12deg' },
  { left: '62%', color: '#6b9d72', delay: '45ms', rotate: '26deg' },
  { left: '76%', color: '#d99b35', delay: '130ms', rotate: '-30deg' },
  { left: '90%', color: '#df6c55', delay: '65ms', rotate: '16deg' },
]

const shouldRender = computed(() => visible.value && !reduced.value)

watch(
  () => props.trigger,
  (trigger) => {
    if (trigger === 0 || reduced.value) {
      return
    }

    visible.value = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      visible.value = false
    }, 1200)
  },
)

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <div
    v-if="shouldRender"
    data-testid="celebration"
    class="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto h-36 max-w-[860px] overflow-hidden"
    aria-hidden="true"
  >
    <i
      v-for="(piece, index) in pieces"
      :key="index"
      class="celebration-piece absolute top-2 block h-2.5 w-1 rounded-sm"
      :style="{
        left: piece.left,
        backgroundColor: piece.color,
        animationDelay: piece.delay,
        rotate: piece.rotate,
      }"
    />
  </div>
</template>

<style scoped>
.celebration-piece {
  animation: confetti-fall 900ms cubic-bezier(0.2, 0.75, 0.3, 1) both;
}

@keyframes confetti-fall {
  0% {
    opacity: 0;
    transform: translate3d(0, -12px, 0) scale(0.8);
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate3d(10px, 120px, 0) rotate(210deg) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .celebration-piece {
    animation: none;
  }
}
</style>

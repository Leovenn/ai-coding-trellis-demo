import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

export function useMotionController() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const reduced = computed(() => prefersReducedMotion.value)

  return { reduced }
}

import type { MaybeRefOrGetter } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'

export function useAnimatedNumber(
  source: MaybeRefOrGetter<number>,
  reduced: MaybeRefOrGetter<boolean>,
  duration = 300,
) {
  const displayed = ref(toValue(source))
  let frame: number | undefined
  let animationId = 0

  function stop() {
    animationId += 1
    if (frame !== undefined && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(frame)
      frame = undefined
    }
  }

  watch(
    () => toValue(source),
    (target) => {
      stop()

      if (toValue(reduced) || typeof requestAnimationFrame === 'undefined') {
        displayed.value = target
        return
      }

      const startValue = displayed.value
      const startedAt = performance.now()
      const currentAnimationId = animationId

      function tick(now: number) {
        if (currentAnimationId !== animationId) {
          return
        }

        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        displayed.value = Math.round(startValue + (target - startValue) * eased)

        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          frame = undefined
        }
      }

      frame = requestAnimationFrame(tick)
    },
  )

  watch(
    () => toValue(reduced),
    (isReduced) => {
      if (isReduced) {
        stop()
        displayed.value = toValue(source)
      }
    },
  )

  onScopeDispose(stop)

  return displayed
}

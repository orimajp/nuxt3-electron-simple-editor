import { Ref } from "nuxt/dist/app/compat/capi"
import { debounce } from 'lodash'
import { useScrollValue } from "./use-scroll-value"

export const useViewerHandleScroll = (
  viewer: Ref<HTMLElement | null>
) => {
  const {
    viewerScrollValue,
    updateEditorScrollValue,
  } = useScrollValue()

  const handleScroll = (e: Event) => {
    if (isScrollRecieved) return
    const el = e.target as Element
    if (el && el.clientHeight && el.scrollHeight) {
      const topEnd = el.scrollHeight - el.clientHeight
      if (topEnd > 0) {
        nextTick(() => {
          updateEditorScrollValue(el.scrollTop / topEnd)
        })
      }
    }
  }

  const debouncedHandleScroll = debounce(handleScroll)

  onMounted(() => {
    viewer.value?.addEventListener('scroll', debouncedHandleScroll)
  })

  onBeforeMount(() => {
    viewer.value?.removeEventListener('scroll', debouncedHandleScroll)
  })

  let isScrollRecieved = false
  let timeoutId: null | number = null
  const setTimeout = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutId = null
    }
    timeoutId = window.setTimeout(() => {
      isScrollRecieved = false
      timeoutId = null
    }, 200)
  }

  const setScrollTop = (v: number) => {
    if (!viewer.value) return
    isScrollRecieved = true
    setTimeout()
    const topEnd =
      (viewer.value as HTMLElement).scrollHeight -
      (viewer.value as HTMLElement).clientHeight
    nextTick(() => {
      ;(viewer.value as HTMLElement).scrollTop = topEnd * v
    })
  }

  const debouncedSetScrollTop = debounce(setScrollTop)

  watch(
    () => viewerScrollValue.value,
    (newVal) => {
      debouncedSetScrollTop(newVal)
    }
  )
}

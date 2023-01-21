<script setup lang="ts">
import { debounce } from 'lodash'

interface Props {
  renderText: string
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  renderText: '',
  height: '100%'
})

const fixedHeight = computed(() => props.height.toString().includes('%') ? props.height : `${props.height}px`)

const { $md } = useNuxtApp()
const renderedText = computed(() => $md.render(props.renderText))

const viewer = ref<HTMLElement | null>(null)
const {
  addNavigateListener,
  removeNavigateListener,
} = useViewNavigate()

const modifyAncher = () => {
  removeNavigateListener()
  addNavigateListener(viewer)
}

const debouncedModifyAncher = debounce(modifyAncher)

watch(
  () => renderedText.value,
  (newVal) => {
    nextTick(() => {
      debouncedModifyAncher()
    })
  }
)

useViewerHandleScroll(viewer)
</script>

<template>
  <div ref="viewer">
    <div
    class="markdown-body"
    v-html="renderedText"
  />
  </div>
</template>

<style>
.markdown-body {
  width: 100%;
  padding: 10px;
/*  padding: 10px 10px 200px 10px;*/
  margin-bottom: 200px;
  height: v-bind(fixedHeight);
}
</style>

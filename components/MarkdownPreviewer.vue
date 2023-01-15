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

const debounced = debounce(modifyAncher)

watch(
  () => renderedText.value,
  (newVal) => {
    nextTick(() => {
      debounced()
    })
  }
)

//const contentHeight = computed(() => `${window.innerHeight}px`)
/*
const contentHeight = ref('0px')

const resizeHeight = () => {
  contentHeight.value = `${window.innerHeight}px`
}

onMounted(() => {
  window.addEventListener('resize', resizeHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHeight)
})

watch(
  () => contentHeight.value,
  (newVal) => {
    console.log(`now height=${newVal}`)
  }
)
*/
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
  height: 100%;
  padding: 10px;
/*  height: v-bind(contentHeight);*/
}
</style>

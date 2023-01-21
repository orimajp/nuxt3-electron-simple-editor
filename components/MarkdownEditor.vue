<script setup lang="ts">
// https://github.com/bazingaedward/monaco-editor-vue3/blob/main/src/MonacoEditor.vue
// https://github.com/nuxt/framework/discussions/5246
// https://berezuzu.medium.com/resizable-monaco-editor-3e922ad54e4

import type { Monaco } from '@monaco-editor/loader'
import type monaco from 'monaco-editor'
//@ts-ignore
import { debounce } from 'lodash'

const APPBAR_HEIGHT = 48

interface Props {
  diffEditor?: boolean
  width?: number | string
  height?: number | string
  original?: string
  modelValue: string
  language?: string
  theme?: string
  options?: Object
}

const props = withDefaults(defineProps<Props>(), {
  diffEditor: false,
  width: '100%',
  height: '100%',
  language: 'javascript',
  theme: 'vs',
  options: () => ({})
})

const emit = defineEmits(['editorWillMount', 'editorDidMount', 'change', 'update:modelValue'])

const editorElement = ref()
const { width, height } = toRefs(props)

const fixedWidth = computed(() => width.value.toString().includes('%') ? width.value : `${width.value}px`)
const fixedHeight = computed(() => height.value.toString().includes('%') ? height.value : `${height.value}px`)

const numberedHeight = ref(0)

const resizeEditor = () => {
  if (editor) {
      const rect = (editorElement.value as Element).getBoundingClientRect()
      editor.layout({ width: rect.width, height: rect.height })
      numberedHeight.value = window.innerHeight - APPBAR_HEIGHT
  }
}

const debounced = debounce(resizeEditor)

let monaco_: Monaco
let editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor

onMounted(() => {
  initMonaco()
  numberedHeight.value = window.innerHeight - APPBAR_HEIGHT
  window.addEventListener('resize', debounced)
})

onBeforeUnmount(() => {
  editor && editor.dispose()
  window.removeEventListener('resize', debounced)
})

watch(
  () => props.options,
  (newVal) => {
    editor.updateOptions(newVal)
  },
  {
    deep: true,
  }
)

watch(
  () => props.modelValue,
  (newVal) => {
    newVal !== _getValue() && _setValue(newVal)
  }
)

watch(
  () => props.original,
  (newVal) => {
    if (newVal) {
      _setOriginal(newVal)
    }
  }
)

watch(
  () => props.language,
  (newVal) => {
    if (!editor) return
    if (props.diffEditor) {
      const { original, modified } = editor.getModel() as monaco.editor.IDiffEditorModel
      monaco_.editor.setModelLanguage(original, newVal)
      monaco_.editor.setModelLanguage(modified, newVal)
    } else {
      monaco_.editor.setModelLanguage(editor.getModel() as monaco.editor.ITextModel, newVal)
    }
  }
)

watch(
  () => props.theme,
  (newVal) => {
    monaco_.editor.setTheme(newVal)
  }
)

const {
  setEditor,
} = useEditorHandlerScroll(numberedHeight)

const initMonaco = async () => {
  const loader = await import('@monaco-editor/loader').then(m => m?.default)
  monaco_ = await loader.init()
  emit('editorWillMount', monaco_)
  editor = monaco_.editor[
    props.diffEditor ? 'createDiffEditor' : 'create'
  ](editorElement.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    ...props.options,
  })

  props.diffEditor && _setModel(props.modelValue, props.original)

  const editor_ = _getEditor() as monaco.editor.IStandaloneCodeEditor | null
  if (editor_) {
    setEditor(editor_)
    editor_.onDidChangeModelContent((event) => {
      const value = editor_.getValue()
      if( props.modelValue != value) {
        emit('change', value, event)
        emit('update:modelValue', value)
      }
    })
  }

  emit('editorDidMount', editor)
}

const _setModel = (value_: string, original?: string) => {
  if (original) {
    (editor as monaco.editor.IStandaloneDiffEditor).setModel({
      original: monaco_.editor.createModel(original, props.language),
      modified: monaco_.editor.createModel(value_, props.language),
    })
  }
}

const _setValue = (value: string) => {
  const editor = _getEditor()
  if (editor) return (editor as monaco.editor.IStandaloneCodeEditor).setValue(value)
}

const _getValue = () => {
  const editor = _getEditor()
  if (!editor) return ''
  return (editor as monaco.editor.IStandaloneCodeEditor).getValue()
}

const _getEditor = () => {
  if (!editor) return null
  //@ts-ignore
  return props.diffEditor ? editor.modifiedEditor : editor
//  return !editor ? null : editor
}

const _setOriginal = (newOriginal: string) => {
  const { original } = editor.getModel() as monaco.editor.IDiffEditorModel
  original.setValue(newOriginal)
}
</script>

<template>
  <div ref="editorElement" :style="{ width: fixedWidth, height: fixedHeight, 'text-align': 'left' }" />
</template>

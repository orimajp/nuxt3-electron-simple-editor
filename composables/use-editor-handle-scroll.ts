import * as monacoEditor from 'monaco-editor'
import { Ref } from 'nuxt/dist/app/compat/capi'
import IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor
import { debounce } from 'lodash'
import { useScrollValue } from './use-scroll-value'


export const useEditorHandlerScroll = (
  windowHeight: Ref<number>
) => {
  let editor: IStandaloneCodeEditor | null = null

  const {
    editorSCrollValue,
    viewerScrollValue, // 確認用
    updateViewerScrollValue,
  } = useScrollValue()
  let isScrollRecieved = false

  watch(
    () => editorSCrollValue.value,
    (val) => {
      console.log(`editorSCrollValue=${val}`)
    }
  )

  watch(
    () => viewerScrollValue.value,
    (val) => {
      console.log(`viewerScrollValue=${val}`)
    }
  )

  const handleScroll = () => {
    if (!editor) return
    if (isScrollRecieved) return
    const scrollTop = editor.getScrollTop()
    const topEnd = editor.getScrollHeight() - windowHeight.value
    if (topEnd > 0) {
      nextTick(() => {
        updateViewerScrollValue(scrollTop / topEnd)
      })
    }
  }

  const debouncedHadleScroll = debounce(handleScroll)

  const setEditor = (codeEditor: IStandaloneCodeEditor) => {
    editor = codeEditor
    editor.onDidScrollChange(debouncedHadleScroll)
  }

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
    if (!editor) return
    isScrollRecieved = true
    setTimeout()
    const topEnd = editor.getScrollHeight() - windowHeight.value
    nextTick(() => {
      editor?.setScrollTop(topEnd * v)
    })
  }

  const debouncedSetScrollTop = debounce(setScrollTop)

  watch(
    () => editorSCrollValue.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        debouncedSetScrollTop(newVal)
      }
    }
  )

  return {
    setEditor,
  }
}

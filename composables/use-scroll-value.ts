export const useScrollValue = () => {
  const viewerScrollValueInternal = useState('viewerScrollValue', () => 0)
  const editorScrollValueInternal = useState('editorScrollValue', () => 0)

  const updateViewerScrollValue = (value: number) => {
    viewerScrollValueInternal.value = value
  }

  const updateEditorScrollValue = (value: number) => {
    editorScrollValueInternal.value = value
  }

  const viewerScrollValue = computed(() =>
    viewerScrollValueInternal.value > 1 ? 1 : viewerScrollValueInternal.value
  )

  const editorSCrollValue = computed(() =>
    editorScrollValueInternal.value > 1 ? 1 : editorScrollValueInternal.value
  )

  return {
    updateViewerScrollValue,
    updateEditorScrollValue,
    viewerScrollValue,
    editorSCrollValue,
  }
}

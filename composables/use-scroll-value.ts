export const useScrollValue = () => {
  const viewerScrollValueInternal = useState('viewerScrollValue', () => 0)
  const editorSCrollValueInternal = useState('editorSCrollValue', () => 0)

  const updateViewerScrollValue = (value: number) => {
    viewerScrollValueInternal.value = value
  }

  const updateEditorScrollValue = (value: number) => {
    editorSCrollValueInternal.value = value
  }

  const viewerScrollValue = computed(() =>
    viewerScrollValueInternal.value > 1 ? 1 : viewerScrollValueInternal.value
  )

  const editorSCrollValue = computed(() =>
    editorSCrollValueInternal.value > 1 ? 1 : editorSCrollValueInternal.value
  )

  return {
    updateViewerScrollValue,
    updateEditorScrollValue,
    viewerScrollValue,
    editorSCrollValue,
  }
}

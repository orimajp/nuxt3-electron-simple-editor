<script setup lang="ts">
// https://vuetifyjs.com/ja/styles/colors/
const APPBAR_HEIGHT = 48

const currentPath = ref('')
const editData = ref('')
const contentHeight = ref('0px')

const titleName = computed(() => currentPath.value === '' ? '新規作成' : currentPath.value)

const resizeHeight = () => {
  contentHeight.value = `${window.innerHeight - APPBAR_HEIGHT}px`
}

onMounted(() => {
  contentHeight.value = `${window.innerHeight - APPBAR_HEIGHT}px`
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

const openFile = async () => {
  //@ts-ignore
  const result = await window.api.openFile()
  if (result) {
    const { filePath, textData } = result
    currentPath.value = filePath
    editData.value = textData
  }
}

const saveFile =async () => {
  //@ts-ignore
  const result = await window.api.saveFile(currentPath.value, editData.value)
  if (result) {
    currentPath.value = result.filePath
  }
}
</script>

<template>
  <v-app>
    <v-app-bar
      color="grey-darken-4"
      density="compact"
    >
      <v-app-bar-title class="document-title">
        {{ titleName }}
      </v-app-bar-title>
      <v-spacer></v-spacer>
        <v-btn
        variant="outlined"
        color="grey"
        @click="openFile"
      >
        開く
      </v-btn>&nbsp;
      <v-btn
        variant="outlined"
        color="grey"
        @click="saveFile">
        保存
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-row>
        <v-col cols="6">
          <MarkdownEditor
          v-model="editData"
          theme="vs-dark"
          language="markdown"
          :height="contentHeight"
          class="editor-area"
        />
        </v-col>
        <v-col
         cols="6"
         >
          <MarkdownPreviewer
          :render-text="editData"
          :height="contentHeight"
          class="preview-area"
          />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  background-color: #212121;
  margin: 0;
}

.document-title {
  font-size: 90%;
  color: grey;
}
.v-row {
  height: 100%;
}

.editor-area {
  height: v-bind(contentHeight);
}

.preview-area {
  height: v-bind(contentHeight);
  overflow: auto;
}
</style>
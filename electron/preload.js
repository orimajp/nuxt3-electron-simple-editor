// https://github.com/ics-creative/150819_electron_text_editor/blob/maiin/src/preload.js
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    /**
   * 【プリロード（中継）】ファイルを開きます。
   * @returns {Promise<{filePath: string, textData:string}>}
   */
  openFile: async () => {
    // メインプロセスの関数を呼び出す
    const result = await ipcRenderer.invoke("openFile")
    return result;
  },

  /**
   * 【プリロード（中継）】ファイルを保存します。
   * @param {string} currentPath 現在編集中のファイルのパス
   * @param {string} textData テキストデータ
   * @returns {Promise<{filePath: string} | void>}
   */
  saveFile: async (currentPath, textData) => {
    // メインプロセスの関数を呼び出す
    const result = await ipcRenderer.invoke("saveFile", currentPath, textData)
    return result
  },  
})

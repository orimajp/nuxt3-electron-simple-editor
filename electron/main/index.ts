// https://gitlab.com/nikosdendrinos/electron-nuxt3-boilerplate/-/blob/main/electron/main/index.ts
// https://github.com/ics-creative/150819_electron_text_editor/blob/maiin/src/main.js
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html

process.env.ROOT = path.join(__dirname, '../..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const preload = path.join(process.env.DIST, 'preload.js')

const bootstrap = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 540,
    webPreferences: {
      preload,
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    /*
    const serverUrl = process.env.VITE_DEV_SERVER_URL
    setTimeout(() => {
      win.loadURL(serverUrl)
      win.webContents.openDevTools()
    }, 10000)
    */
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }
  win.on('resize', () => {
    const size =  win.getSize()
    const width = size[0]
    const height = size[1]
//    console.log(`window width:${width}, height=${height}`)
  })
}

app.whenReady().then(() => {
  bootstrap()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) bootstrap()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/**
 * 【メインプロセス】ファイルを開きます。
 * @returns {Promise<null|{textData: string, filePath: string}>}
 */
const openFile = async (): Promise<null | { textData: string, filePath: string }> => {
  const win = BrowserWindow.getFocusedWindow() as BrowserWindow

  const result = await dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ["openFile"],
      filters: [
        {
          name: "Documents",
          // 読み込み可能な拡張子を指定
          extensions: ["txt", "html", "md", "js", "ts"],
        },
      ],
    }
  )

  // [ファイル選択]ダイアログが閉じられた後の処理
  if (result.filePaths.length > 0) {
    const filePath = result.filePaths[0];

    // テキストファイルを読み込む
    const textData = fs.readFileSync(filePath, "utf8");
    // ファイルパスとテキストデータを返却
    return {
      filePath,
      textData,
    }
  }

  // ファイル選択ダイアログで何も選択しなかった場合は、nullを返しておく
  return null
}

/**
 * 【メインプロセス】ファイルを保存します。
 * @param event
 * @param {string} currentPath 現在編集中のファイルのパス
 * @param {string} textData テキストデータ
 * @returns {Promise<{filePath: string} | void>} 保存したファイルのパス
 */
const saveFile = async (event: Event, currentPath: string, textData: string): Promise<{filePath: string} | void>  => {
  let saveFilePath: string;

  //　初期の入力エリアに設定されたテキストを保存しようとしたときは新規ファイルを作成する
  if (currentPath) {
    saveFilePath = currentPath;
  } else {
    const win = BrowserWindow.getFocusedWindow() as BrowserWindow
    // 新規ファイル保存の場合はダイアログをだし、ファイル名をユーザーに決定してもらう
    const result = await dialog.showSaveDialog(
      win,
      // どんなダイアログを出すかを指定するプロパティ
      {
        //@ts-ignore
        properties: ["openFile"],
        filters: [
          {
            name: "Documents",
            extensions: ["md"],
          },
        ],
      }
    );
    // キャンセルした場合
    if (result.canceled) {
      // 処理を中断
      return;
    }
    saveFilePath = result.filePath as string;
  }

  // ファイルを保存
  fs.writeFileSync(saveFilePath, textData);

  return { filePath: saveFilePath };
}

// レンダラープロセスとの連携
ipcMain.handle("openFile", openFile);
ipcMain.handle("saveFile", saveFile);

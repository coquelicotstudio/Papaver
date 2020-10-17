'use strict'

import { app, protocol, dialog, Menu, BrowserWindow, ipcMain} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
          {
             label:'New File',
             accelerator: 'CmdOrCtrl+1',
             // this is the main bit hijack the click event
             click() {
                win.webContents.send('NEW_FILE', 'new file')
             }
         },
        {
           label:'Open File',
           accelerator: 'CmdOrCtrl+O',
           // this is the main bit hijack the click event
           click() {
              // construct the select file dialog
              dialog.showOpenDialog({
                properties: ['openFile']
              })
              .then(function(fileObj) {
                 // the fileObj has two props
                 if (!fileObj.canceled) {
                   win.webContents.send('FILE_OPEN', fileObj.filePaths)
                 }
              })
  // should always handle the error yourself, later Electron release might crash if you don't
              .catch(function(err) {
                 console.error(err)
              })
           }
       },
       {
          label:'Save File',
          accelerator: 'CmdOrCtrl+s',
          // this is the main bit hijack the click event
          click() {
             // construct the select file dialog
             dialog.showSaveDialog({
             })
             .then(function(fileObj) {
                // the fileObj has two props
                console.log(fileObj, 'here');
                if (!fileObj.canceled) {
                  win.webContents.send('FILE_SAVE', fileObj.filePath)
                }
             })
 // should always handle the error yourself, later Electron release might crash if you don't
             .catch(function(err) {
                console.error(err)
             })
          }
      },
       {
           label:'Exit',
           click() {
              app.quit()
           }
         }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})




// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

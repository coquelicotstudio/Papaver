'use strict'

import { app, protocol, dialog, Menu, BrowserWindow, ipcMain} from 'electron'
const Electron_store = require('electron-store');
const path = require('path');
const fs = require('fs');
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let editing = false;
let currentfile = '';
const electron_store = new Electron_store();

const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
          {
             label:'New File',
             accelerator: 'CmdOrCtrl+n',
             // this is the main bit hijack the click event
             click() {
               editing = false;
                menu.items[1].submenu.items[1].enabled = false;
                win.webContents.send('NEW_FILE', 'new file')
             }
         },
        {
           label:'Open File',
           accelerator: 'CmdOrCtrl+o',
           // this is the main bit hijack the click event
           click() {
              // construct the select file dialog
              const default_dir = electron_store.get('default-directory');
              dialog.showOpenDialog({
                properties: ['openFile'],
                title: "Open File",
                defaultPath:default_dir,
              })
              .then(function(fileObj) {
                 // the fileObj has two props
                 if (!fileObj.canceled) {
                   console.log(fileObj);
                   win.webContents.send('FILE_OPEN', fileObj.filePaths)
                   editing = true;
                   currentfile = path.parse(fileObj.filePaths[0]).name;
                   menu.items[1].submenu.items[1].enabled = true;
                 }
              })
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
             const default_dir = electron_store.get('default-directory');
             let preview = '';
             dialog.showSaveDialog({
               filters: [{
                  name: 'markdown (.md)',
                  extensions: ['md']
                }],
               defaultPath:default_dir,
               title: "Save File"
             })
             .then(function(fileObj) {
                // the fileObj has two props
                if (!fileObj.canceled) {
                  let dir = path.parse(fileObj.filePath).dir;
                  let name = path.parse(fileObj.filePath).name
                  let els = dir.split(path.sep);
                  let type = els[els.length-1];
                  win.webContents.send('FILE_SAVE', {file:fileObj.filePath, type:type, name:name, preview:preview})
                }
             })
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
    },
    {
      label:'Preferences',
      submenu:[
        {
          label:'Set default directory',
          accelerator:"CmdOrCtrl+d",
          click() {
            dialog.showOpenDialog({
              title: "Set the default directory",
              properties: ['openDirectory']
            })
            .then(function(fileObj) {
              console.log(fileObj);
               // the fileObj has two props
               if (!fileObj.canceled) {
                 electron_store.set('default-directory', fileObj.filePaths[0]);
               }
            })
            .catch(function(err) {
               console.error(err)
            })
          }
        },
        {
          label: 'Change preview image',
          accelerator:"CmdOrCtrl+i",
          enabled:editing,
          click() {
            const default_dir = electron_store.get('default-directory');
            dialog.showOpenDialog({
              title: "Change preview image",
              properties: ['openFile'],
              defaultPath: path.join(default_dir, 'images'),
            })
            .then(function(fileObj) {
               // the fileObj has two props
               const default_dir = electron_store.get('default-directory');
               if (!fileObj.canceled) {
                 console.log(fileObj.filePaths);
                 let img = path.parse(fileObj.filePaths[0]).base;
                 fs.readFile(path.join(default_dir, 'blog.json'), 'utf8', function(err, data){
                   data = JSON.parse(data)
                  data.entries[currentfile].preview = img;
                  fs.writeFile(path.join(default_dir, 'blog.json'), JSON.stringify(data), function(err){
                    if (err) return console.log(err);
                  })
                 })
               }
            })
            .catch(function(err) {
               console.error(err)
            })
          }
        }
      ]
    },
    {
      label:'Dashboard',
      accelerator: 'CmdOrCtrl+a',
      click() {
        win.webContents.send('DASH', {})
      }
    }
  ])


  // Menu.setApplicationMenu(menu)



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
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: true
    }
  })

  win.maximize()


  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  // win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })


  let default_dir = electron_store.get('default-directory');
  default_dir = (default_dir ? default_dir : '');
  fs.access(default_dir, (err) => {
    if(err) {

      let child = new BrowserWindow({ width:200, height:200, parent: win, modal: true, frame:false})
      child.once('ready-to-show', () => {
        child.show()
      })
      dialog.showMessageBox(child, {
        type:"info",
        title:"Default post directory missing!",
        message:"You don't have a default directory for your articles yet. Set it now!",
        buttons:["Let's do it!"]
      })
      .then(function() {
        child.destroy();
        dialog.showOpenDialog({
          title: "Set the default directory",
          properties: ['openDirectory']
        })
        .then(function(fileObj) {
           // the fileObj has two props
           if (!fileObj.canceled) {
             default_dir = fileObj.filePaths[0];
             electron_store.set('default-directory', fileObj.filePaths[0]);
           }
        })
        .catch(function(err) {
           console.error(err)
        })
      })
    }
  })

  const blog = path.join(default_dir, 'blog.json')
  fs.access(blog, (err) => {
    if (err) {
      fs.writeFile(blog, JSON.stringify({entries:{}, home:{image:''}}), function (err) {
        if (err) return console.log(err);
      });
      }
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

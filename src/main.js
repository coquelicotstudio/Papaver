function elsqst() {
  if (require('electron-squirrel-startup')) return;
}

elsqst()

import { app } from 'electron'
console.log(app);


// this should be placed at top of main.js to handle setup events quickly
function hse (){
  if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
  }
}

hse()


function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {
      console.log(error)
    }

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
}

const { ipcRenderer} = window.require('electron');
const { dialog } = require('electron').remote;
const Electron_store = require('electron-store');

import Vue from 'vue'
import App from './App.vue'

const electron_store = new Electron_store();



Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, 'ipcRenderer', { value: ipcRenderer });
Object.defineProperty(Vue.prototype, 'electron_store', { value: electron_store });
Object.defineProperty(Vue.prototype, 'dialog', { value: dialog });



new Vue({
  render: h => h(App),
}).$mount('#app')
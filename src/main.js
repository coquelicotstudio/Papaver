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

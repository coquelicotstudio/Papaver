import Stackedit from 'stackedit-js'
const fs = require('fs');
const { ipcRenderer } = window.require('electron')
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, 'stackedit', { value: new Stackedit() });
Object.defineProperty(Vue.prototype, 'fs', { value: fs });
Object.defineProperty(Vue.prototype, 'ipcRenderer', { value: ipcRenderer });


new Vue({
  render: h => h(App),
}).$mount('#app')

import Stackedit from 'stackedit-js'
import dialog from 'electron'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, 'stackedit', { value: new Stackedit() });
Object.defineProperty(Vue.prototype, 'dialog', { value: dialog });
// Object.defineProperty(Vue.prototype, 'dialog', { value: dialog });

new Vue({
  render: h => h(App),
}).$mount('#app')

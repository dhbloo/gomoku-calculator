import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import store from './store/index.js'

// Redirect to https pages
if (process.env.NODE_ENV != 'development') {
  let loc = window.location.href + ''
  if (loc.indexOf('http://') == 0) {
    window.location.href = loc.replace('http://', 'https://')
  }
}

Vue.config.productionTip = false

require('es6-promise').polyfill()

const FastClick = require('fastclick')
FastClick.attach(document.body)

import ConfirmPlugin from 'vux/src/plugins/confirm'
import AlertPlugin from 'vux/src/plugins/alert'
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

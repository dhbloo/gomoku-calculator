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

// Fix error of redundant navigation to current location
const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

require('es6-promise').polyfill()
require('fastclick').attach(document.body)

import ConfirmPlugin from 'vux/src/plugins/confirm'
import AlertPlugin from 'vux/src/plugins/alert'
import ToastPlugin from 'vux/src/plugins/toast'
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)

Vue.config.productionTip = process.env.NODE_ENV == 'development'

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')

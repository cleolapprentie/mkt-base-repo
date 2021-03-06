import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import detectBrowser from './plugins/detectBrowser'
import prerenderHelper from './plugins/prerenderHelper'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)
Vue.use(VueMeta)
Vue.use(detectBrowser)
Vue.use(prerenderHelper)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

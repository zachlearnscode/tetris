import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 50,
  touchHoldTolerance: 100,
  swipeTolerance: 30,
  longTapTimeInterval: 100,
  namespace: 'tap'
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents, {
  disableClick: true,
  touchClass: '',
  tapTolerance: 3,
  touchHoldTolerance: 100,
  swipeTolerance: 10,
  longTapTimeInterval: 400,
  namespace: 'tap'
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

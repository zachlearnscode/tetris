import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vue2TouchEvents from 'vue2-touch-events'
import VueMeta from 'vue-meta'
 
Vue.use(VueMeta);

Vue.use(Vue2TouchEvents, {
  disableClick: true,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 50,
  swipeTolerance: 15,
  longTapTimeInterval: 400,
  namespace: 'tap'
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

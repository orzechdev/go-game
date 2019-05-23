import Vue from 'vue'
// import VueWorker from 'vue-worker'
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

// Vue.use(VueWorker)

new Vue({
  render: h => h(App),
}).$mount('#app')

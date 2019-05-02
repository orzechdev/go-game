import Vue from 'vue'
import './plugins/vuetify'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuetify)

new Vue({
  render: h => h(App),
}).$mount('#app')

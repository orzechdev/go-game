import Vue from 'vue'
import Router from 'vue-router'
import Play from './views/Play.vue'
import Preferences from './views/Preferences.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history', // History mode is disabled as on Github redirection from other url to index.html is not handled 
  routes: [
    {
      path: '/',
      name: 'play',
      component: Play
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: Preferences
    }
  ]
})

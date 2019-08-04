import Vue from 'vue'
import Router from 'vue-router'
import Play from './views/Play.vue'
import Preferences from './views/Preferences.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'play',
      component: Play
    },
    {
      path: '/preferences',
      name: 'preferences',
      // route level code-splitting
      // this generates a separate chunk (preferences.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "preferences" */ './views/Preferences.vue')
      component: Preferences
    }
  ]
})

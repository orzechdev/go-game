import Vue from 'vue'
import Router from 'vue-router'
import Play from './views/Play.vue'
import Settings from './views/Settings.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'play',
      component: Play
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (settings.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue')
      component: Settings
    }
  ]
})

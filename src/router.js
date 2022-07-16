import Vue from 'vue'
import Router from 'vue-router'
import Game from './views/Game.vue'
import Settings from './views/Settings.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ /* webpackPrefetch: true */ './views/About.vue'),
    },
    {
      path: '/:pos?',
      name: 'game',
      component: Game,
    },
  ],
})

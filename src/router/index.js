import Vue from 'vue'
import Router from 'vue-router'
import NewList from '@/components/NewList'
import Play from '@/components/Play'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
      {
          path: '/',
          name: 'NewList',
          component: NewList
      },
      {
          path: '/play',
          name: 'Play',
          component: Play
      }
  ]
})

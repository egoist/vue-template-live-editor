import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Editor = () => import('./Editor.vue')

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: Editor,
    name: 'home'
  }]
})

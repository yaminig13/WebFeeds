import Vue from 'vue'
import Router from 'vue-router'
import Feeds from '@/components/Feeds'
import NewFeed from '@/components/NewFeed'
import EditFeed from '@/components/EditFeed'
import Register from '@/components/Register'
import Login from '@/components/Login'
import ParseFeed from '@/components/ParseFeed'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/feeds',
      name: 'Feeds',
      component: Feeds
    },
    {
      path: '/feeds/new',
      name: 'NewFeed',
      component: NewFeed
    },
    {
      path: '/feeds/:id',
      name: 'EditFeed',
      component: EditFeed
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/parseFeed/:id',
      name: 'ParseFeed',
      component: ParseFeed
    }
  ]
})

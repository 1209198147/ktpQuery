import LoginView from '@/views/ktp/LoginView.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/ktpQuery'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/ktpQuery',
    name: 'ktpQuery',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ktp/CourseView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

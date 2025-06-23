import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/components/Admin.vue'
import Dashboard from '@/components/Dashboard.vue'
import Finance from '@/components/Finance.vue'
import Request from '@/components/Request.vue'
import Navbar from '@/components/NavBar.vue'


const routes = [
  {
    path: '/',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/navbar',
    name: 'Navbar',
    component: Navbar
  },
  {
    path: '/finance',
    name: 'Finance',
    component: Finance

  },
  {
    path: '/request',
    name: 'Request',
    component: Request

  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

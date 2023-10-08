import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useGlobalStore } from '../stores/global-store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: '/auth/login',
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    beforeEnter: async (to, from, next) => {
      try {
        const store = useGlobalStore()

        store.user = await (await fetch('/api/1.0/auth')).json()
        store.server = await (await fetch('/api/1.0/server')).json()

        next()
      } catch {
        next('/auth/login')
      }
    },
    children: [
      {
        name: 'profile',
        path: 'profile',
        component: () => import('../pages/admin/profile/Profile.vue'),
      },
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'vpn',
        path: 'vpn',
        component: () => import('../pages/admin/vpn/Vpn.vue'),
      },
      {
        name: 'vpn-add',
        path: 'vpn-add',
        component: () => import('../pages/admin/vpn/VpnSetup.vue'),
      },
      {
        name: 'apps',
        path: 'apps',
        component: () => import('../pages/admin/apps/Apps.vue'),
      },
      {
        name: 'server',
        path: 'server',
        component: () => import('../pages/admin/server/Server.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      document.querySelector('.app-layout__page')?.scrollTo(0, 0)
    }
  },
  routes,
})

export default router

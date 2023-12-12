import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useGlobalStore } from '../stores/global-store'
import RouteViewComponent from '../layouts/RouterBypass.vue'

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

        await store.fetchUserInfo()
        store.server = await (await fetch('/api/1.0/server')).json()

        next()
      } catch {
        next('/auth/login')
      }
    },
    children: [
      {
        component: RouteViewComponent,
        path: '',
        children: [
          {
            name: 'profile',
            path: 'profile',
            component: () => import('../pages/admin/profile/Profile.vue'),
          },
          {
            name: 'settings',
            path: 'settings',
            component: () => import('../pages/settings/Settings.vue'),
          },
        ],
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
    beforeEnter: async (to, from, next) => {
      const store = useGlobalStore()

      await store.fetchUserInfo()

      next()
    },
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        name: 'logout',
        path: 'logout',
        component: () => import('../pages/auth/login/Logout.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
      },
      {
        name: 'verify-email',
        path: 'verify-email',
        component: () => import('../pages/auth/login/VerifyEmail.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
      },
      {
        name: 'oauth',
        path: 'oauth',
        component: () => import('../pages/auth/oauth/OAuth2.vue'),
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

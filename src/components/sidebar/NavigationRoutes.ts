export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'vpn',
      displayName: 'menu.vpn',
      meta: {
        icon: 'fa-shield',
      },
    },
    {
      name: 'apps',
      displayName: 'menu.apps',
      meta: {
        icon: 'fa-cubes',
      },
    },
    {
      name: 'server',
      displayName: 'menu.server',
      meta: {
        icon: 'fa-server',
      },
    },
    {
      name: 'pages',
      displayName: 'menu.pages',
      meta: {
        icon: 'vuestic-iconset-files',
      },
      disabled: true,
      children: [
        {
          name: 'login',
          displayName: 'menu.login-singup',
        },
        {
          name: '404-pages',
          displayName: 'menu.404-pages',
        },
        {
          name: 'faq',
          displayName: 'menu.faq',
        },
      ],
    },
  ] as INavigationRoute[],
}

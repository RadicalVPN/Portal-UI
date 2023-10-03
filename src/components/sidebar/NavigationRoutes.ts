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
  ] as INavigationRoute[],
}

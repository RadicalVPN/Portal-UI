import { defineStore } from 'pinia'

interface LastVpnTrafficHash {
  [key: string]: {
    rx: number
    tx: number
  }
}

interface VpnServer {
  id: string
  hostname: string
  country: string
  city: string
  internal_ip: string
  external_ip: string
  public_key: string
  private_key: string
  online: boolean
}

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      isSidebarMinimized: false,
      user: {
        active: true,
        email: 'N/A',
        username: 'N/A',
        id: 0,
        totp: false,
      },
      lastVpnTrafficHash: {} as LastVpnTrafficHash,
      vpns: [] as any[],
      server: [] as VpnServer[],
      theme: 'light',
    }
  },
  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },
    async refreshServerList() {
      this.server = await (await fetch('/api/1.0/server')).json()
    },
    changeUserName(userName: string) {
      this.user.username = userName
    },

    changeUserMail(userName: string) {
      this.user.username = userName
    },
    humanFileSize(size: number) {
      if (size < 1024) return size + ' B'
      const i = Math.floor(Math.log(size) / Math.log(1024))
      const num = size / Math.pow(1024, i)
      const round = Math.round(num)
      const out = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round
      return `${out} ${'KMGTPEZY'[i - 1]}B`
    },
  },
})

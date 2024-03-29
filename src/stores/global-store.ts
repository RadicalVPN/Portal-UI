import { useStorage } from '@vueuse/core'
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
  load: number
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
        emailSha256: '',
        registered: '',
      },
      lastVpnTrafficHash: {} as LastVpnTrafficHash,
      vpns: [] as any[],
      server: [] as VpnServer[],
      theme: useStorage('theme', 'dark'),
    }
  },
  actions: {
    async refreshServerList() {
      this.server = await (await fetch('/api/1.0/server')).json()
    },
    async fetchUserInfo() {
      try {
        this.user = await (await fetch('/api/1.0/auth')).json()
      } catch (e) {
        console.log('failed to fetch user info')
      }
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

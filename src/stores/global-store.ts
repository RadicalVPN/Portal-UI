import { defineStore } from 'pinia'

interface LastVpnTrafficHash {
  [key: string]: {
    rx: number
    tx: number
  }
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
      },
      lastVpnTrafficHash: {} as LastVpnTrafficHash,
      vpns: [] as any[],
    }
  },
  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
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

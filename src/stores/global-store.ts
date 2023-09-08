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
        name: 'N/A',
        mail: 'N/A',
      },
      lastVpnTrafficHash: {} as LastVpnTrafficHash,
    }
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },

    changeUserName(userName: string) {
      this.user.name = userName
    },

    changeUserMail(userName: string) {
      this.user.name = userName
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

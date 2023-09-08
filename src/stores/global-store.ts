import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      isSidebarMinimized: false,
      user: {
        name: 'N/A',
        mail: 'N/A',
      },
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
  },
})

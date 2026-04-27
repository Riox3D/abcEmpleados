import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userAprobar: null,
    menu: [],

  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    setUser(user) {
      this.user = user
    },
    setUserAprobar(userAprobar) {
      this.userAprobar = userAprobar
    },
    setMenu(menuItems) {
      this.menu = menuItems
    },
  

    async logout() {
      await api.post('/auth/logout')
      this.user = null
      this.userAprobar = null
      this.menu = []
    }
  }
})

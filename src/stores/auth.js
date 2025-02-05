import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(username, password) {
      this.loading = true
      try {
        const response = await api.post('/auth/login', { username, password })
        this.token = response.data.token
        this.user = username
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', this.user)
        return true
      } finally {
        this.loading = false
      }
    },

    async logout() {
      if (!this.token) return

      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      }
    },

    async register(username, email, password) {
      this.loading = true
      try {
        await api.post('/auth/register', { username, email, password })
        return true
      } finally {
        this.loading = false
      }
    },

    async requestPasswordReset(email) {
      return await api.post('/auth/reset-password', { email })
    },

    async resetPassword(token, newPassword) {
      return await api.post('/auth/reset-password/confirm', { token, new_password: newPassword })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

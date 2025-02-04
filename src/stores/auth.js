import { defineStore } from 'pinia'
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
        localStorage.setItem('token', this.token)
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
      return await api.post('/auth/reset-password-request', { email })
    },

    async resetPassword(token, newPassword) {
      return await api.post('/auth/reset-password', { token, password: newPassword })
    },
  },
})

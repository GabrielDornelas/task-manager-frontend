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
    async login(email, password) {
      try {
        this.loading = true
        const response = await api.post('/auth/login', { email, password })
        this.token = response.data.token
        localStorage.setItem('token', this.token)
        return true
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
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

    async requestPasswordReset(email) {
      try {
        await api.post('/auth/reset-password-request', { email })
        return true
      } catch (error) {
        throw error
      }
    },

    async resetPassword(token, newPassword) {
      try {
        await api.post('/auth/reset-password', { token, password: newPassword })
        return true
      } catch (error) {
        throw error
      }
    },
  },
})

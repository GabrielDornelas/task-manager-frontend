import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Garantir que estamos usando a URL correta do backend
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Desabilitar cache globalmente
  cache: false,
})

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Remover o header Access-Control-Allow-Credentials do cliente
  delete config.headers['Access-Control-Allow-Credentials']
  return config
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error) // Debug
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  },
)

export default boot(({ app }) => {
  // Disponibilizar a URL da API globalmente
  app.config.globalProperties.$apiUrl = API_URL
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }

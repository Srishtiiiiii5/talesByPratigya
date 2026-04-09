import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://storybook-6zo3.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,   // 60s — Render free tier can take ~30-50s to cold-start
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tbp-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — but NOT during login itself
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRoute = err.config?.url?.includes('/auth/login')
    if (err.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem('tbp-user')
      localStorage.removeItem('tbp-token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

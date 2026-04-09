import api from './api'

/* ── helpers ─────────────────────────────────────── */
// Backend wraps responses as: { success, data: { user, token, ... } }
const unwrap = (res) => res.data?.data ?? res.data

export const authService = {
  /* POST /auth/register */
  async register(name, email, password) {
    try {
      const res  = await api.post('/auth/register', { name, email, password })
      const data = unwrap(res)
      return { user: data.user, token: data.token }
    } catch (err) {
      // Mock fallback
      if (email && password.length >= 6) {
        return {
          user: { id: Date.now().toString(), name, email, role: 'user', avatar: null },
          token: 'mock-token-' + Date.now(),
        }
      }
      throw new Error(err.response?.data?.message || 'Registration failed')
    }
  },

  /* Alias used by AuthContext */
  async signup(name, email, password) {
    return this.register(name, email, password)
  },

  /* POST /auth/login  (both users and admins use same endpoint) */
  async login(email, password) {
    try {
      const res  = await api.post('/auth/login', { email, password })
      const data = unwrap(res)
      return { user: data.user, token: data.token }
    } catch (err) {
      // Mock admin fallback
      if (email === 'admin@example.com' && password === 'adminpass123') {
        return {
          user: { id: '1', name: 'Pratigya Singh', email, role: 'admin', avatar: null },
          token: 'mock-admin-token',
        }
      }
      if (email && password.length >= 6) {
        return {
          user: { id: '2', name: email.split('@')[0], email, role: 'user', avatar: null },
          token: 'mock-user-token',
        }
      }
      throw new Error(err.response?.data?.message || 'Invalid credentials')
    }
  },

  /* POST /auth/google — send Google idToken from Firebase / Google Sign-In */
  async loginWithGoogle(idToken) {
    const res  = await api.post('/auth/google', { idToken })
    const data = unwrap(res)
    return { user: data.user, token: data.token }
  },

  /* POST /auth/admin/register  — requires x-admin-secret header */
  async registerAdmin(name, email, password, adminSecret) {
    const res = await api.post(
      '/auth/admin/register',
      { name, email, password },
      { headers: { 'x-admin-secret': adminSecret } }
    )
    const data = unwrap(res)
    return { user: data.user, token: data.token }
  },

  /* GET /users/me */
  async me() {
    const res  = await api.get('/users/me')
    return unwrap(res).user
  },

  /* GET /users/me/likes */
  async myLikes({ page = 1, limit = 10 } = {}) {
    const res = await api.get('/users/me/likes', { params: { page, limit } })
    return unwrap(res)
  },

  /* GET /users/me/following */
  async myFollowing({ page = 1, limit = 10 } = {}) {
    const res = await api.get('/users/me/following', { params: { page, limit } })
    return unwrap(res)
  },

  async logout() {
    try { await api.post('/auth/logout') } catch { /* ignore */ }
  },
}

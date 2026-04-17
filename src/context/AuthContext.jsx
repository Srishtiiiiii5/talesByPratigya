import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('tbp-user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    localStorage.setItem('tbp-user', JSON.stringify(data.user))
    if (data.token) localStorage.setItem('tbp-token', data.token)
    return data
  }

  const signup = async (name, email, password) => {
    const data = await authService.signup(name, email, password)
    setUser(data.user)
    localStorage.setItem('tbp-user', JSON.stringify(data.user))
    if (data.token) localStorage.setItem('tbp-token', data.token)
    return data
  }

  const loginWithGoogle = async (idToken) => {
    const data = await authService.loginWithGoogle(idToken)
    setUser(data.user)
    localStorage.setItem('tbp-user', JSON.stringify(data.user))
    if (data.token) localStorage.setItem('tbp-token', data.token)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tbp-user')
    localStorage.removeItem('tbp-token')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

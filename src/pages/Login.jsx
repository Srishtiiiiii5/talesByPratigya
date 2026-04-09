import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { FiMoon, FiSun } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Login() {
  const { login }        = useAuth()
  const { lang, toggle: toggleLang, t } = useLanguage()
  const { isDark, toggle: toggleTheme } = useTheme()
  const navigate         = useNavigate()
  const location         = useLocation()
  const from             = location.state?.from?.pathname || '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error(lang === 'hi' ? 'सभी फ़ील्ड भरें।' : 'Fill all fields.'); return }
    setLoading(true)
    try {
      await login(email, password)
      toast.success(lang === 'hi' ? 'स्वागत है! 🎉' : 'Welcome back! 🎉')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || (lang === 'hi' ? 'लॉगिन विफल।' : 'Login failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-gold-700">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9933A' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="relative flex flex-col justify-center items-center text-center p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-serif text-4xl font-bold text-white mb-3">Tales by Pratigya</h1>
            <p className="hindi-text text-cream-200 text-xl mb-8">प्रतिज्ञा की कलम से</p>
            <div className="gold-divider gold-divider-center" />
            <p className="hindi-text text-cream-300 mt-6 text-lg leading-relaxed max-w-sm">
              {lang === 'hi'
                ? '"शब्दों में वह शक्ति है जो दुनिया बदल सके।"'
                : '"Words have the power to change the world."'}
            </p>
            <p className="hindi-text text-gold-400 mt-3">— प्रतिज्ञा सिंह</p>
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-story-light dark:bg-story-dark">
        {/* Top right controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={toggleLang} className="btn-ghost text-sm font-semibold">{lang === 'hi' ? 'EN' : 'हि'}</button>
          <button onClick={toggleTheme} className="btn-ghost p-2">
            {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="block lg:hidden font-serif text-xl font-bold text-gold-600 dark:text-gold-400 mb-8">
              Tales by Pratigya
            </Link>
            <h2 className="hindi-text font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 mb-1">
              {t('loginTitle')}
            </h2>
            <p className="hindi-text text-ink-400 dark:text-ink-300">{t('loginSubtitle')}</p>
          </div>

          {/* Hint for dev */}
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 mb-6 text-xs text-ink-500 dark:text-ink-300">
            {/* <strong>Admin:</strong> admin@talesbypratigya.com / admin123 */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-500 dark:text-ink-300 mb-1.5 hindi-text">{t('emailAddress')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-ink-500 dark:text-ink-300 hindi-text">{t('password')}</label>
                <a href="#" className="text-xs text-gold-600 dark:text-gold-400 hover:underline hindi-text">{t('forgotPassword')}</a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                >
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 hindi-text disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('loading')}
                </span>
              ) : t('login')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-cream-200 dark:bg-ink-600" />
            <span className="text-xs text-ink-300 dark:text-ink-400 hindi-text">{t('orContinueWith')}</span>
            <div className="flex-1 h-px bg-cream-200 dark:bg-ink-600" />
          </div>

          {/* Google (UI only) */}
          <button
            type="button"
            onClick={() => toast(lang === 'hi' ? 'Google लॉगिन जल्द आ रहा है!' : 'Google login coming soon!')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-cream-300 dark:border-ink-500 hover:bg-cream-100 dark:hover:bg-ink-600 transition-all duration-200 hindi-text text-sm font-medium text-ink-600 dark:text-ink-200"
          >
            <FcGoogle className="w-5 h-5" />
            {t('continueWithGoogle')}
          </button>

          {/* Signup link */}
          <p className="text-center text-sm text-ink-400 dark:text-ink-300 mt-6 hindi-text">
            {t('noAccount')}{' '}
            <Link to="/signup" className="text-gold-600 dark:text-gold-400 font-semibold hover:underline">
              {t('signup')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

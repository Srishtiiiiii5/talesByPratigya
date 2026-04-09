import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { FiMoon, FiSun } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Signup() {
  const { signup }       = useAuth()
  const { lang, toggle: toggleLang, t } = useLanguage()
  const { isDark, toggle: toggleTheme } = useTheme()
  const navigate         = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error(lang === 'hi' ? 'सभी फ़ील्ड भरें।' : 'Fill all fields.'); return }
    if (password !== confirm) { toast.error(lang === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.'); return }
    if (password.length < 6)  { toast.error(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षर का हो।' : 'Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await signup(name, email, password)
      toast.success(lang === 'hi' ? 'खाता बनाया गया! 🎉' : 'Account created! 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.message || (lang === 'hi' ? 'साइन अप विफल।' : 'Signup failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gold-700 via-ink-800 to-ink-900">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v5h5v5H0v5h20v-9.5zm-2 4.5h-1v-1h1v1zm-3 0h-1v-1h1v1zm-3 0h-1v-1h1v1zm7-3h-1v-1h1v1zm-3 0h-1v-1h1v1zm-3 0h-1v-1h1v1z' fill='%23C9933A' fill-opacity='0.4'/%3E%3C/svg%3E")` }}
        />
        <div className="relative flex flex-col justify-center items-center text-center p-12 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-serif text-4xl font-bold text-white mb-3">Tales by Pratigya</h1>
            <p className="hindi-text text-cream-200 text-xl mb-8">एक नई यात्रा का आरंभ</p>
            <div className="gold-divider gold-divider-center" />
            <div className="grid grid-cols-2 gap-6 mt-8 text-center">
              {[
                { n: '3+', label: lang === 'hi' ? 'कहानियाँ' : 'Stories' },
                { n: '40k+', label: lang === 'hi' ? 'पाठक' : 'Readers' },
                { n: '15+', label: lang === 'hi' ? 'भाग' : 'Parts' },
                { n: 'Free', label: lang === 'hi' ? 'बिल्कुल मुफ्त' : 'Always Free' },
              ].map(({ n, label }) => (
                <div key={label} className="bg-white/10 rounded-xl p-4">
                  <p className="font-serif text-2xl font-bold text-gold-400">{n}</p>
                  <p className="hindi-text text-sm text-cream-300 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-story-light dark:bg-story-dark">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={toggleLang} className="btn-ghost text-sm font-semibold">{lang === 'hi' ? 'EN' : 'हि'}</button>
          <button onClick={toggleTheme} className="btn-ghost p-2">
            {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="block lg:hidden font-serif text-xl font-bold text-gold-600 dark:text-gold-400 mb-8">
              Tales by Pratigya
            </Link>
            <h2 className="hindi-text font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 mb-1">
              {t('signupTitle')}
            </h2>
            <p className="hindi-text text-ink-400 dark:text-ink-300">{t('signupSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-ink-500 dark:text-ink-300 mb-1.5 hindi-text">{t('fullName')}</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'hi' ? 'आपका नाम' : 'Your name'} className="input-field pl-11" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-ink-500 dark:text-ink-300 mb-1.5 hindi-text">{t('emailAddress')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field pl-11" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-ink-500 dark:text-ink-300 mb-1.5 hindi-text">{t('password')}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300">
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-ink-500 dark:text-ink-300 mb-1.5 hindi-text">{t('confirmPassword')}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                <input type={showPass ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="input-field pl-11" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 hindi-text disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('loading')}
                </span>
              ) : t('signup')}
            </button>
          </form>

          {/* Google */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-cream-200 dark:bg-ink-600" />
            <span className="text-xs text-ink-300 dark:text-ink-400 hindi-text">{t('orContinueWith')}</span>
            <div className="flex-1 h-px bg-cream-200 dark:bg-ink-600" />
          </div>
          <button type="button" onClick={() => toast(lang === 'hi' ? 'Google लॉगिन जल्द आ रहा है!' : 'Coming soon!')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-cream-300 dark:border-ink-500 hover:bg-cream-100 dark:hover:bg-ink-600 transition-all duration-200 hindi-text text-sm font-medium text-ink-600 dark:text-ink-200">
            <FcGoogle className="w-5 h-5" />
            {t('continueWithGoogle')}
          </button>

          <p className="text-center text-sm text-ink-400 dark:text-ink-300 mt-6 hindi-text">
            {t('haveAccount')}{' '}
            <Link to="/login" className="text-gold-600 dark:text-gold-400 font-semibold hover:underline">{t('login')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

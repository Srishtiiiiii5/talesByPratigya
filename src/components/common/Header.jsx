import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX, HiBell, HiSearch } from 'react-icons/hi'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { isSubscribed, toggleSubscription } from '../../utils/helpers'

export default function Header() {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang, t }  = useLanguage()
  const { user, logout, isAdmin }        = useAuth()
  const navigate = useNavigate()

  const [scrolled,      setScrolled]      = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [showUserMenu,  setShowUserMenu]  = useState(false)
  const [notifOpen,     setNotifOpen]     = useState(false)
  const [subscribed,    setSubscribed]    = useState(isSubscribed())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubscribe = () => {
    const next = toggleSubscription()
    setSubscribed(next)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const navItems = [
    { to: '/',           labelKey: 'home' },
    { to: '/stories',    labelKey: 'stories' },
    { to: '/blogs',      labelKey: 'blogs' },
    { to: '/guidelines', labelKey: 'guidelines' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-glass shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-serif text-xl font-bold text-gold-600 dark:text-gold-400 tracking-wide group-hover:text-gold-500 transition-colors">
            Tales by Pratigya
          </span>
          <span className="hindi-text text-xs text-ink-400 dark:text-ink-300 tracking-widest">
            प्रतिज्ञा की कलम से
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map(({ to, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link hindi-text ${isActive ? 'active' : ''}`}
            >
              {t(labelKey)}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {t('admin')}
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="btn-ghost text-sm font-semibold hidden sm:inline-flex"
            title="Switch language"
          >
            {lang === 'hi' ? 'EN' : 'हि'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>

          {/* Notification bell */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="btn-ghost p-2"
            >
              <HiBell className="w-4 h-4" />
              {subscribed && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 card p-4 text-sm"
                >
                  <p className="font-semibold text-ink-700 dark:text-ink-50 mb-3 hindi-text">
                    {t('notificationsTitle')}
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={handleSubscribe}
                      className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                        subscribed ? 'bg-gold-500' : 'bg-cream-300 dark:bg-ink-500'
                      } relative`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                          subscribed ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-ink-500 dark:text-ink-200 hindi-text">
                      {t('subscribeAll')}
                    </span>
                  </label>
                  <p className="mt-3 text-ink-300 dark:text-ink-400 text-xs hindi-text">
                    {t('noNotifications')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu / Auth buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 btn-ghost"
              >
                <span className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </span>
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-48 card py-2 text-sm"
                  >
                    <p className="px-4 py-2 text-ink-400 dark:text-ink-300 text-xs border-b border-cream-200 dark:border-ink-500">
                      {user.name}
                    </p>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 hover:bg-cream-100 dark:hover:bg-ink-600 transition-colors"
                      >
                        {t('dashboard')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-cream-100 dark:hover:bg-ink-600 transition-colors text-red-500"
                    >
                      {t('logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm hidden sm:inline-flex">
              {t('login')}
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenuAlt3 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-glass border-t border-cream-200 dark:border-ink-600"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navItems.map(({ to, labelKey }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `hindi-text text-base py-2 border-b border-cream-200 dark:border-ink-600 ${
                      isActive ? 'text-gold-600 dark:text-gold-400 font-semibold' : 'text-ink-500 dark:text-ink-200'
                    }`
                  }
                >
                  {t(labelKey)}
                </NavLink>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={toggleLang} className="btn-secondary text-sm flex-1">
                  {lang === 'hi' ? 'Switch to English' : 'हिंदी में देखें'}
                </button>
                {!user && (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">
                    {t('login')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

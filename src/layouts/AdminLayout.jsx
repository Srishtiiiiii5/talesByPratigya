import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { HiViewGrid, HiPencil, HiBookOpen, HiCollection, HiLogout } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { FiMoon, FiSun } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { t }            = useLanguage()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { to: '/admin',                end: true,  icon: HiViewGrid,   label: t('dashboard') },
    { to: '/admin/create-post',    end: false, icon: HiPencil,     label: t('createPost') },
    { to: '/admin/create-story',   end: false, icon: HiBookOpen,   label: t('createStory') },
    { to: '/admin/manage',         end: false, icon: HiCollection, label: t('manageContent') },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-ink-800 dark:bg-ink-900 flex flex-col fixed top-0 bottom-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-ink-700">
          <Link to="/" className="block">
            <span className="font-serif text-lg font-bold text-gold-400">Tales by Pratigya</span>
            <p className="text-xs text-ink-400 mt-0.5">Admin Panel</p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500 text-white'
                    : 'text-ink-300 hover:bg-ink-700 hover:text-ink-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-ink-700 space-y-1">
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-ink-300 hover:bg-ink-700 w-full"
          >
            {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-ink-300 hover:bg-ink-700"
          >
            ← View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-ink-700 w-full"
          >
            <HiLogout className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 bg-cream-50 dark:bg-ink-700 min-h-screen">
        {/* Top bar */}
        <header className="bg-white dark:bg-ink-800 border-b border-cream-200 dark:border-ink-600 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-400 dark:text-ink-300">
              {user?.name}
            </span>
            <span className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

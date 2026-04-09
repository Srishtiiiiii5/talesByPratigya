import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiMail } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-cream-200 dark:border-ink-600 bg-cream-100 dark:bg-ink-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="block mb-3">
              <span className="font-serif text-2xl font-bold text-gold-600 dark:text-gold-400">
                Tales by Pratigya
              </span>
              <p className="hindi-text text-sm text-ink-400 dark:text-ink-300 mt-0.5">
                प्रतिज्ञा की कलम से
              </p>
            </Link>
            <p className="hindi-text text-sm text-ink-400 dark:text-ink-300 leading-relaxed">
              शब्दों की दुनिया में आपका स्वागत है — ऐतिहासिक गाथाएँ, रहस्यमय कहानियाँ और प्रेम कथाएँ।
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="btn-ghost p-2 rounded-full" title="Instagram">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="btn-ghost p-2 rounded-full" title="Twitter">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="mailto:contact@talesbypratigya.com" className="btn-ghost p-2 rounded-full" title="Email">
                <FiMail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-ink-600 dark:text-ink-100 mb-4 hindi-text">
              त्वरित लिंक
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('home') },
                { to: '/stories', label: t('stories') },
                { to: '/blogs', label: t('blogs') },
                { to: '/login', label: t('login') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hindi-text text-sm text-ink-400 dark:text-ink-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-ink-600 dark:text-ink-100 mb-4 hindi-text">
              नई कहानियों की सूचना पाएँ
            </h4>
            <p className="hindi-text text-sm text-ink-400 dark:text-ink-300 mb-4">
              हर नई कहानी और ब्लॉग पोस्ट के लिए अपना ईमेल दर्ज करें।
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="आपका ईमेल"
                className="input-field text-sm flex-1"
              />
              <button type="submit" className="btn-primary text-sm px-4">
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-cream-200 dark:border-ink-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-300 dark:text-ink-400">
          <p className="hindi-text">{t('copyright')}</p>
          <p className="font-serif text-gold-600/50 dark:text-gold-400/40 tracking-wider">
            © Tales by Pratigya | Unauthorized use prohibited
          </p>
        </div>
      </div>
    </footer>
  )
}

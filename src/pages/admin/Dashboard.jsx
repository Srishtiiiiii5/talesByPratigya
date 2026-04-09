import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiBookOpen, HiPencil, HiHeart, HiEye, HiPlus, HiTrendingUp } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { storyService } from '../../services/storyService'
import { blogService }  from '../../services/blogService'

export default function AdminDashboard() {
  const { lang, t } = useLanguage()
  const [stories, setStories] = useState([])
  const [blogs,   setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([storyService.getStories(), blogService.getBlogs()])
      .then(([s, b]) => { setStories(s.data ?? s); setBlogs(b.data ?? b) })
      .finally(() => setLoading(false))
  }, [])

  const totalReads  = stories.reduce((a, s) => a + (s.readCount || 0), 0)
  const totalLikes  = stories.reduce((a, s) => a + (s.likeCount || 0), 0) + blogs.reduce((a, b) => a + (b.likeCount || 0), 0)

  const stats = [
    { icon: HiBookOpen,    label: lang === 'hi' ? 'कहानियाँ'   : 'Stories',     value: stories.length,        color: 'text-blue-500'  },
    { icon: HiPencil,      label: lang === 'hi' ? 'ब्लॉग'      : 'Blogs',       value: blogs.length,          color: 'text-purple-500' },
    { icon: HiEye,         label: lang === 'hi' ? 'कुल पाठक'   : 'Total Reads', value: `${(totalReads/1000).toFixed(1)}k`, color: 'text-green-500' },
    { icon: HiHeart,       label: lang === 'hi' ? 'कुल पसंद'   : 'Total Likes', value: `${(totalLikes/1000).toFixed(1)}k`, color: 'text-red-500'  },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 hindi-text">
          {t('dashboard')}
        </h1>
        <p className="text-ink-400 dark:text-ink-300 mt-1 hindi-text">
          {lang === 'hi' ? 'आपकी सामग्री का सारांश' : 'Overview of your content'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-card"
          >
            <Icon className={`w-6 h-6 ${color} mb-3`} />
            <p className="text-2xl font-bold text-ink-700 dark:text-ink-50">{value}</p>
            <p className="text-sm text-ink-400 dark:text-ink-300 hindi-text">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/create-story"
          className="flex items-center gap-4 bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <HiBookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">{t('createStory')}</p>
            <p className="text-sm text-ink-400 dark:text-ink-300 hindi-text">
              {lang === 'hi' ? 'नई कहानी या भाग जोड़ें' : 'Add a new story or part'}
            </p>
          </div>
          <HiPlus className="ml-auto w-5 h-5 text-ink-300" />
        </Link>

        <Link
          to="/admin/create-post"
          className="flex items-center gap-4 bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <HiPencil className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">{t('createPost')}</p>
            <p className="text-sm text-ink-400 dark:text-ink-300 hindi-text">
              {lang === 'hi' ? 'नया ब्लॉग पोस्ट लिखें' : 'Write a new blog post'}
            </p>
          </div>
          <HiPlus className="ml-auto w-5 h-5 text-ink-300" />
        </Link>
      </div>

      {/* Stories table */}
      <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-card overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-cream-200 dark:border-ink-600 flex items-center justify-between">
          <h2 className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">
            {lang === 'hi' ? 'कहानियाँ' : 'Stories'}
          </h2>
          <Link to="/admin/manage" className="text-sm text-gold-600 dark:text-gold-400 hindi-text">
            {t('manageContent')} →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-ink-400 dark:text-ink-400 border-b border-cream-100 dark:border-ink-700">
                <th className="text-left px-6 py-3 hindi-text">{t('title')}</th>
                <th className="text-left px-6 py-3 hindi-text">{lang === 'hi' ? 'भाग' : 'Parts'}</th>
                <th className="text-left px-6 py-3 hindi-text">{lang === 'hi' ? 'पाठक' : 'Reads'}</th>
                <th className="text-left px-6 py-3 hindi-text">{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-ink-300 hindi-text">{t('loading')}</td></tr>
              ) : stories.map(s => (
                <tr key={s.id} className="border-b border-cream-100 dark:border-ink-700 hover:bg-cream-50 dark:hover:bg-ink-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink-700 dark:text-ink-50 hindi-text">{lang === 'hi' ? s.titleHi : s.titleEn}</p>
                    <p className="text-xs text-ink-400 dark:text-ink-400 hindi-text">{s.author.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-500 dark:text-ink-300">{s.totalParts}</td>
                  <td className="px-6 py-4 text-sm text-ink-500 dark:text-ink-300">{(s.readCount/1000).toFixed(1)}k</td>
                  <td className="px-6 py-4">
                    <span className={`tag text-xs hindi-text ${s.status === 'completed' ? 'bg-green-100 text-green-700' : 'tag-gold'}`}>
                      {s.status === 'completed' ? (lang === 'hi' ? 'पूर्ण' : 'Complete') : (lang === 'hi' ? 'जारी' : 'published')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

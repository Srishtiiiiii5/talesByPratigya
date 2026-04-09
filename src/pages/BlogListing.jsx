import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { blogService } from '../services/blogService'
import BlogCard from '../components/blog/BlogCard'
import { CardGridSkeleton } from '../components/common/LoadingSkeleton'

const CATEGORIES = [
  { key: 'all',       hiLabel: 'सभी',      enLabel: 'All' },
  { key: 'sahitya',   hiLabel: 'साहित्य',   enLabel: 'Literature' },
  { key: 'history',   hiLabel: 'इतिहास',   enLabel: 'History' },
  { key: 'writing',   hiLabel: 'लेखन',     enLabel: 'Writing' },
  { key: 'travel',    hiLabel: 'यात्रा',    enLabel: 'Travel' },
]

export default function BlogListing() {
  const { lang, t } = useLanguage()
  const [blogs,    setBlogs]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    blogService.getBlogs()
      .then(res => setBlogs(res.data ?? res))
      .finally(() => setLoading(false))
  }, [])

  const filtered = category === 'all'
    ? blogs
    : blogs.filter(b => b.group === category || b.category === category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title hindi-text"
        >
          {t('allBlogs')}
        </motion.h1>
        <div className="gold-divider gold-divider-center" />
        <p className="hindi-text text-ink-400 dark:text-ink-300 mt-3">
          {lang === 'hi'
            ? 'साहित्य, इतिहास, यात्रा और लेखन पर प्रतिज्ञा सिंह के विचार'
            : "Pratigya Singh's thoughts on literature, history, travel and writing"}
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hindi-text ${
              category === c.key
                ? 'bg-gold-500 text-white shadow-golden'
                : 'bg-cream-100 dark:bg-ink-600 text-ink-500 dark:text-ink-200 hover:bg-cream-200 dark:hover:bg-ink-500'
            }`}
          >
            {lang === 'hi' ? c.hiLabel : c.enLabel}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <CardGridSkeleton count={4} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-400 dark:text-ink-300 hindi-text">
          {lang === 'hi' ? 'इस श्रेणी में कोई ब्लॉग नहीं मिला।' : 'No blogs found in this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

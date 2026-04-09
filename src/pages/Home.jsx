import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiBookOpen, HiStar } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import { storyService } from '../services/storyService'
import { blogService }  from '../services/blogService'
import StoryCard from '../components/story/StoryCard'
import BlogCard  from '../components/blog/BlogCard'
import { CardGridSkeleton } from '../components/common/LoadingSkeleton'
import { toggleSubscription, isSubscribed } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Home() {
  const { lang, t } = useLanguage()

  const [stories,   setStories]   = useState([])
  const [blogs,     setBlogs]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [subscribed, setSubscribed] = useState(isSubscribed())

  useEffect(() => {
    Promise.all([storyService.getStories(), blogService.getBlogs()])
      .then(([s, b]) => {
        setStories(s.data ?? s)
        setBlogs(b.data ?? b)
      })
      .finally(() => setLoading(false))
  }, [])

  const featured = stories.find(s => s.featured) ?? stories[0]

  const handleSubscribe = () => {
    const next = toggleSubscription()
    setSubscribed(next)
    toast.success(next
      ? (lang === 'hi' ? 'सब्सक्राइब कर लिया! ✨' : 'Subscribed! ✨')
      : (lang === 'hi' ? 'सब्सक्रिप्शन रद्द की।' : 'Unsubscribed.')
    )
  }

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-gold-700 opacity-95" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9933A' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 tag tag-gold mb-6 hindi-text"
            >
              <HiStar className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-gold-400">
                {lang === 'hi' ? 'प्रतिज्ञा सिंह द्वारा' : 'By Pratigya Singh'}
              </span>
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hindi-text font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              {t('heroTagline')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="hindi-text text-cream-200 text-lg leading-relaxed mb-8 max-w-lg"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/stories" className="btn-primary">
                <HiBookOpen className="w-4 h-4" />
                {t('exploreStories')}
              </Link>
              <Link to="/blogs" className="btn-secondary !text-white !border-white/40 hover:!bg-white hover:!text-ink-700">
                {t('readBlogs')}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-8 mt-12"
            >
              {[
                { n: '3+', label: lang === 'hi' ? 'कहानियाँ' : 'Stories' },
                { n: '40k+', label: lang === 'hi' ? 'पाठक' : 'Readers' },
                { n: '11k+', label: lang === 'hi' ? 'पसंद' : 'Likes' },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="font-serif text-2xl font-bold text-gold-400">{n}</p>
                  <p className="hindi-text text-sm text-cream-300">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Featured story card */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gold-500/10 rounded-3xl blur-2xl" />
                <Link
                  to={`/stories/${featured.id}`}
                  className="relative block bg-ink-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-500/20 shadow-golden-lg hover:shadow-golden hover:-translate-y-1 transition-all duration-300"
                >
                  {featured.coverImage && (
                    <img
                      src={featured.coverImage}
                      alt={lang === 'hi' ? featured.titleHi : featured.titleEn}
                      className="w-full h-80 object-cover opacity-90"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  )}
                  <div className="p-6">
                    <span className="tag tag-gold text-xs mb-3 inline-block hindi-text">
                      {t('featuredStory')}
                    </span>
                    <h2 className="hindi-text font-serif text-xl font-bold text-white mb-2">
                      {lang === 'hi' ? featured.titleHi : featured.titleEn}
                    </h2>
                    <p className="hindi-text text-cream-300 text-sm line-clamp-2">
                      {lang === 'hi' ? featured.descriptionHi : featured.descriptionEn}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-gold-400 text-sm font-medium hindi-text">
                      {t('readNow')} <HiArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-gold-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Latest Stories ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title hindi-text">{t('latestStories')}</h2>
            <div className="gold-divider" />
          </div>
          <Link to="/stories" className="btn-ghost text-sm hindi-text">
            {t('viewAll')} <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(0, 3).map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── Newsletter Banner ───────────────────────────────── */}
      <section className="bg-gradient-to-r from-ink-800 to-gold-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="hindi-text font-serif text-3xl font-bold text-white mb-3">
            {lang === 'hi' ? 'नई कहानियों की सूचना पाएँ' : 'Get Notified of New Stories'}
          </h2>
          <p className="hindi-text text-cream-200 mb-8">
            {lang === 'hi'
              ? 'प्रतिज्ञा सिंह की हर नई कहानी और ब्लॉग पोस्ट सबसे पहले आप तक पहुँचे।'
              : 'Be the first to read every new story and blog post by Pratigya Singh.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleSubscribe}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 hindi-text ${
                subscribed
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-ink-800 hover:bg-cream-100'
              }`}
            >
              {subscribed ? `✓ ${t('subscribed')}` : t('subscribe')}
            </button>
          </div>
        </div>
      </section>

      {/* ── Latest Blogs ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title hindi-text">{t('latestBlogs')}</h2>
            <div className="gold-divider" />
          </div>
          <Link to="/blogs" className="btn-ghost text-sm hindi-text">
            {t('viewAll')} <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <CardGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.slice(0, 4).map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

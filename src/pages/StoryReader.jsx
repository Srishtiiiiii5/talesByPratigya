import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiMenuAlt3, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'
import { useTheme }    from '../context/ThemeContext'
import { storyService } from '../services/storyService'
import ReadingProgressBar from '../components/common/ReadingProgressBar'
import WatermarkOverlay   from '../components/common/WatermarkOverlay'
import PartNavigation     from '../components/story/PartNavigation'
import { ReaderSkeleton } from '../components/common/LoadingSkeleton'
import { enableContentProtection, applyProtectedClass } from '../utils/contentProtection'
import { saveReadProgress, formatDate } from '../utils/helpers'

export default function StoryReader() {
  const { id, partId }           = useParams()
  const { lang, t, toggle: toggleLang } = useLanguage()
  const { isDark, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [story,    setStory]    = useState(null)
  const [parts,    setParts]    = useState([])
  const [part,     setPart]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [tocOpen,  setTocOpen]  = useState(false)
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('tbp-reader-fontsize') || 18))

  const contentRef = useRef(null)

  /* ── data ── */
  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    Promise.all([
      storyService.getStory(id),
      storyService.getParts(id),
      storyService.getPart(id, partId),          // now takes (storyId, partId)
    ]).then(([s, p, pt]) => {
      setStory(s)
      setParts(p)
      setPart(pt)
      if (s && pt) saveReadProgress(id, partId)
    }).finally(() => setLoading(false))
  }, [id, partId])

  /* ── content protection ── */
  useEffect(() => {
    const cleanup = enableContentProtection()
    if (contentRef.current) applyProtectedClass(contentRef.current)
    return cleanup
  }, [part])

  /* ── persist font size ── */
  const changeFontSize = (delta) => {
    setFontSize(prev => {
      const next = Math.min(26, Math.max(14, prev + delta))
      localStorage.setItem('tbp-reader-fontsize', next)
      return next
    })
  }

  /* ── apply dark-mode class to html ── */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  if (loading) return (
    <div className="min-h-screen bg-story-light dark:bg-story-dark">
      <ReadingProgressBar />
      <ReaderSkeleton />
    </div>
  )

  if (!part) return (
    <div className="min-h-screen bg-story-light dark:bg-story-dark flex items-center justify-center">
      <div className="text-center">
        <p className="hindi-text text-ink-400 mb-4 text-lg">{t('notFound')}</p>
        <button onClick={() => navigate(-1)} className="btn-primary">{t('backHome')}</button>
      </div>
    </div>
  )

  const storyTitle = story ? (lang === 'hi' ? (story.titleHi || story.title) : (story.titleEn || story.title)) : ''
  const partTitle  = lang === 'hi' ? (part.titleHi || part.title) : (part.titleEn || part.title)

  return (
    <div className="min-h-screen bg-story-light dark:bg-story-dark transition-colors duration-300">
      <ReadingProgressBar />

      {/* ── Top toolbar (standalone — no site header) ── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-glass border-b border-cream-200 dark:border-ink-600">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">

          {/* Back arrow */}
          <Link
            to={`/stories/${id}`}
            className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors shrink-0 hindi-text"
          >
            <HiChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline max-w-[160px] truncate">{storyTitle}</span>
          </Link>

          {/* Part title — center */}
          <p className="hindi-text text-xs text-ink-400 dark:text-ink-300 truncate flex-1 text-center hidden sm:block">
            {partTitle}
          </p>

          {/* Controls — right */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {/* Font size */}
            <button
              onClick={() => changeFontSize(-2)}
              className="btn-ghost px-2 py-1 text-xs font-semibold"
              title="Decrease font size"
            >
              A−
            </button>
            <span className="text-xs text-ink-300 dark:text-ink-500 select-none">{fontSize}</span>
            <button
              onClick={() => changeFontSize(2)}
              className="btn-ghost px-2 py-1 text-xs font-semibold"
              title="Increase font size"
            >
              A+
            </button>

            {/* Theme */}
            <button onClick={toggleTheme} className="btn-ghost p-2 ml-1" title="Toggle theme">
              {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            {/* Language */}
            <button onClick={toggleLang} className="btn-ghost px-2 py-1 text-xs font-semibold">
              {lang === 'hi' ? 'EN' : 'हि'}
            </button>

            {/* TOC */}
            <button
              onClick={() => setTocOpen(v => !v)}
              className="btn-ghost p-2"
              title={t('tableOfContents')}
            >
              {tocOpen ? <HiX className="w-4 h-4" /> : <HiMenuAlt3 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── TOC drawer ── */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setTocOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-story-card dark:bg-ink-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 pt-16">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">
                    {storyTitle}
                  </h3>
                  <button onClick={() => setTocOpen(false)} className="btn-ghost p-1">
                    <HiX className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-ink-400 mb-4 hindi-text uppercase tracking-wider">
                  {t('tableOfContents')}
                </p>
                <div className="space-y-1">
                  {parts.map((p, idx) => (
                    <Link
                      key={p.id || p._id}
                      to={`/stories/${id}/read/${p.id || p._id}`}
                      onClick={() => setTocOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm hindi-text transition-colors ${
                        (p.id || p._id) === partId
                          ? 'bg-gold-500/15 text-gold-700 dark:text-gold-400 font-semibold'
                          : 'text-ink-500 dark:text-ink-200 hover:bg-cream-100 dark:hover:bg-ink-700'
                      }`}
                    >
                      <span className="text-xs text-ink-300 mr-2">{idx + 1}.</span>
                      {lang === 'hi' ? (p.titleHi || p.title) : (p.titleEn || p.title)}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Reading area ── */}
      <main className="max-w-2xl mx-auto px-5 sm:px-8 pt-20 pb-24">

        {/* Part header */}
        <motion.header
          key={partId + '-header'}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-medium text-gold-600 dark:text-gold-400 mb-2 hindi-text tracking-wide">
            {storyTitle}
          </p>
          <h1
            className="hindi-text font-serif font-bold text-ink-800 dark:text-ink-50 leading-snug mb-4"
            style={{ fontSize: `${Math.round(fontSize * 1.9)}px` }}
          >
            {partTitle}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-ink-300 dark:text-ink-400">
            {part.publishedAt && <span className="hindi-text">{formatDate(part.publishedAt, lang)}</span>}
            {part.readingTimeMin && (
              <>
                <span>·</span>
                <span className="hindi-text">{part.readingTimeMin} {t('minutes')}</span>
              </>
            )}
          </div>
          <div className="w-12 h-0.5 bg-gold-500 rounded-full mx-auto mt-6" />
        </motion.header>

        {/* Protected content */}
        <div className="relative">
          <WatermarkOverlay />
          <motion.div
            key={partId + '-body'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            ref={contentRef}
            className="prose-story protected-content relative z-0 hindi-text text-ink-700 dark:text-ink-100"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.1 }}
            dangerouslySetInnerHTML={{
              __html: part.content || `<p class="hindi-text">${part.summary || part.titleHi || ''}</p>`,
            }}
          />
        </div>

        {/* Part navigation */}
        <PartNavigation storyId={id} currentPart={part} parts={parts} />

        {/* Back to story link */}
        <div className="text-center mt-10">
          <Link
            to={`/stories/${id}`}
            className="text-sm text-ink-400 dark:text-ink-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors hindi-text"
          >
            ← {lang === 'hi' ? 'कहानी की सूची पर वापस जाएँ' : 'Back to story overview'}
          </Link>
        </div>
      </main>
    </div>
  )
}

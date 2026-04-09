import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiHeart, HiClock, HiShare, HiChatAlt, HiArrowUp } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import { useAuth }     from '../context/AuthContext'
import { blogService } from '../services/blogService'
import ReadingProgressBar from '../components/common/ReadingProgressBar'
import WatermarkOverlay   from '../components/common/WatermarkOverlay'
import { DetailSkeleton } from '../components/common/LoadingSkeleton'
import { enableContentProtection, applyProtectedClass } from '../utils/contentProtection'
import { isLiked, toggleLike, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function BlogDetail() {
  const { id }      = useParams()
  const { lang, t } = useLanguage()
  const { user }    = useAuth()

  const [blog,     setBlog]     = useState(null)
  const [comments, setComments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [liked,    setLiked]    = useState(false)
  const [comment,  setComment]  = useState('')
  const [posting,  setPosting]  = useState(false)
  const [fontSize, setFontSize] = useState(
    () => Number(localStorage.getItem('tbp-essay-fontsize') || 18)
  )
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    Promise.all([blogService.getBlog(id), blogService.getComments(id)])
      .then(([b, c]) => {
        setBlog(b)
        setComments(c ?? [])
        setLiked(isLiked('blog', id))
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const cleanup = enableContentProtection()
    if (contentRef.current) applyProtectedClass(contentRef.current)
    return cleanup
  }, [blog])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const changeFontSize = (delta) => {
    setFontSize(prev => {
      const next = Math.min(26, Math.max(14, prev + delta))
      localStorage.setItem('tbp-essay-fontsize', next)
      return next
    })
  }

  const handleLike = async () => {
    if (!user) { toast.error(t('loginToLike')); return }
    const wasLiked = liked
    setLiked(!wasLiked)
    toggleLike('blog', id)
    try {
      if (wasLiked) {
        await blogService.unlikeBlog(id)
      } else {
        await blogService.likeBlog(id)
      }
    } catch {
      // revert on failure
      setLiked(wasLiked)
      toggleLike('blog', id)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) { toast.error(t('loginToComment')); return }
    if (!comment.trim()) return
    setPosting(true)
    try {
      const newC = await blogService.addComment(id, { text: comment })
      setComments(prev => [...prev, newC])
      setComment('')
      toast.success(lang === 'hi' ? 'टिप्पणी जोड़ी गई!' : 'Comment added!')
    } catch {
      toast.error(lang === 'hi' ? 'टिप्पणी नहीं जुड़ सकी।' : 'Could not post comment.')
    } finally {
      setPosting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await blogService.deleteComment(commentId)
      setComments(prev => prev.filter(c => (c._id || c.id) !== commentId))
      toast.success(lang === 'hi' ? 'हटाया गया।' : 'Deleted.')
    } catch {
      toast.error(lang === 'hi' ? 'हटाने में समस्या।' : 'Could not delete.')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title || blog?.titleHi, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success(lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied!')
    }
  }

  if (loading) return <><ReadingProgressBar /><DetailSkeleton /></>

  if (!blog) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="hindi-text text-ink-400 text-lg mb-4">{t('notFound')}</p>
        <Link to="/blogs" className="btn-primary hindi-text">{t('allBlogs')}</Link>
      </div>
    </div>
  )

  // Support both backend fields (title/content) and mock fields (titleHi/contentHi)
  const title    = lang === 'hi' ? (blog.titleHi || blog.title)    : (blog.titleEn || blog.title)
  const content  = lang === 'hi' ? (blog.contentHi || blog.content) : (blog.contentEn || blog.contentHi || blog.content)
  const category = lang === 'hi' ? (blog.categoryHi || blog.category || blog.group) : (blog.categoryEn || blog.category || blog.group)
  const totalLikes = (blog.likeCount || 0) + (liked && !isLiked('blog', id) ? 1 : 0)

  return (
    <>
      <ReadingProgressBar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">

        {/* Cover image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-80 shadow-card"
        >
          <img
            src={blog.coverImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.parentElement.className += ' bg-gradient-to-br from-ink-800 to-gold-700'
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {category && (
            <span className="tag tag-gold hindi-text text-sm mb-4 inline-block">{category}</span>
          )}

          <h1
            className="hindi-text font-serif font-bold text-ink-800 dark:text-ink-50 leading-tight mb-5"
            style={{ fontSize: `${Math.round(fontSize * 1.8)}px` }}
          >
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-400 dark:text-ink-300 mb-4">
            <span className="font-semibold text-ink-600 dark:text-ink-200">{blog.author.name || 'Pratigya Singh'}</span>
            {blog.publishedAt && <span className="hindi-text">{formatDate(blog.publishedAt, lang)}</span>}
            {blog.readingTimeMin && (
              <span className="flex items-center gap-1">
                <HiClock className="w-3.5 h-3.5" />
                {blog.readingTimeMin} {t('minutes')}
              </span>
            )}
          </div>

          {/* Font size controls inline */}
          <div className="flex items-center gap-2 mb-8 pb-8 border-b border-cream-200 dark:border-ink-600">
            <span className="text-xs text-ink-400 dark:text-ink-400 hindi-text mr-1">
              {lang === 'hi' ? 'अक्षर आकार:' : 'Font size:'}
            </span>
            <button
              onClick={() => changeFontSize(-2)}
              className="btn-ghost px-2.5 py-1 text-xs font-bold border border-cream-200 dark:border-ink-600 rounded-lg"
            >
              A−
            </button>
            <span className="text-xs text-ink-300 dark:text-ink-500 w-6 text-center select-none">{fontSize}</span>
            <button
              onClick={() => changeFontSize(2)}
              className="btn-ghost px-2.5 py-1 text-xs font-bold border border-cream-200 dark:border-ink-600 rounded-lg"
            >
              A+
            </button>
          </div>
        </motion.div>

        {/* Protected content */}
        <div className="relative">
          <WatermarkOverlay />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            ref={contentRef}
            className="prose-story protected-content relative z-0 hindi-text text-ink-700 dark:text-ink-100"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.05 }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Like / Share bar */}
        <div className="flex items-center gap-3 mt-10 pt-8 border-t border-cream-200 dark:border-ink-600">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 hindi-text text-sm font-medium ${
              liked
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                : 'border-cream-300 dark:border-ink-500 text-ink-500 dark:text-ink-200 hover:border-gold-400'
            }`}
          >
            <HiHeart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            {liked ? t('liked') : t('likePost')}
            <span className="text-xs ml-0.5 opacity-70">({totalLikes})</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 btn-ghost text-sm hindi-text"
          >
            <HiShare className="w-4 h-4" />
            {t('share')}
          </button>
        </div>

        {/* Comments */}
        <section className="mt-12">
          <h2 className="hindi-text font-serif text-2xl font-bold text-ink-700 dark:text-ink-50 mb-6 flex items-center gap-2">
            <HiChatAlt className="w-5 h-5 text-gold-500" />
            {t('comments')}
            <span className="text-base font-normal text-ink-400 ml-1">({comments.length})</span>
          </h2>

          {/* Comment form */}
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={user ? t('commentPlaceholder') : t('loginToComment')}
              disabled={!user || posting}
              rows={3}
              className="input-field resize-none mb-3 hindi-text"
            />
            {!user ? (
              <Link to="/login" className="btn-secondary text-sm hindi-text">
                {t('login')} {lang === 'hi' ? 'करके टिप्पणी करें' : 'to comment'}
              </Link>
            ) : (
              <button
                type="submit"
                disabled={!comment.trim() || posting}
                className="btn-primary text-sm hindi-text disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting
                  ? <span className="flex items-center gap-2"><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> ...</span>
                  : t('submitComment')}
              </button>
            )}
          </form>

          {/* Comment list */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="hindi-text text-ink-400 dark:text-ink-300 text-center py-8">
                {lang === 'hi' ? 'अभी कोई टिप्पणी नहीं। पहले टिप्पणी करें!' : 'No comments yet. Be the first!'}
              </p>
            ) : comments.map((c) => {
              const cId = c._id || c.id
              return (
                <div key={cId} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-600 dark:text-gold-400 font-bold text-sm shrink-0">
                      {(c.authorName || c.user?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-ink-700 dark:text-ink-50">
                          {c.authorName || c.user?.name || 'User'}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-ink-300 dark:text-ink-400">
                            {formatDate(c.createdAt, lang)}
                          </p>
                          {user && (user.id === c.authorId || user.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteComment(cId)}
                              className="text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="hindi-text text-sm text-ink-500 dark:text-ink-200 leading-relaxed">
                        {c.text || c.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Scroll-to-top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-6 w-11 h-11 rounded-full bg-gold-500 text-white shadow-golden flex items-center justify-center hover:bg-gold-600 transition-colors z-30"
          >
            <HiArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiTrash, HiBookOpen, HiPencilAlt, HiEye, HiEyeOff, HiViewList } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { storyService } from '../../services/storyService'
import { blogService }  from '../../services/blogService'
import { formatDate }   from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ManageContent() {
  const { lang, t } = useLanguage()
  const [tab,     setTab]     = useState('stories')
  const [stories, setStories] = useState([])
  const [blogs,   setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [acting,  setActing]  = useState(null) // id of item currently being actioned

  useEffect(() => {
    Promise.all([storyService.getStories(), blogService.getBlogs()])
      .then(([s, b]) => {
        setStories(s.data ?? s)
        setBlogs(b.data ?? b)
      })
      .finally(() => setLoading(false))
  }, [])

  /* ── helpers ── */
  const confirm = (msg) => window.confirm(msg)

  /* ── Story actions ── */
  const publishStory = async (id) => {
    setActing(id)
    try {
      await storyService.publishStory(id)
      setStories(prev => prev.map(s => (s.id === id || s._id === id) ? { ...s, status: 'published' } : s))
      toast.success(lang === 'hi' ? 'प्रकाशित किया!' : 'Published!')
    } catch { toast.error('Error') } finally { setActing(null) }
  }
  const unpublishStory = async (id) => {
    setActing(id)
    try {
      await storyService.unpublishStory(id)
      setStories(prev => prev.map(s => (s.id === id || s._id === id) ? { ...s, status: 'draft' } : s))
      toast.success(lang === 'hi' ? 'अप्रकाशित किया!' : 'Unpublished!')
    } catch { toast.error('Error') } finally { setActing(null) }
  }
  const deleteStory = async (id) => {
    if (!confirm(lang === 'hi' ? 'क्या आप वाकई हटाना चाहते हैं?' : 'Are you sure you want to delete?')) return
    setActing(id)
    try {
      await storyService.deleteStory(id)
      setStories(prev => prev.filter(s => s.id !== id && s._id !== id))
      toast.success(lang === 'hi' ? 'हटाया गया!' : 'Deleted!')
    } catch { toast.error(lang === 'hi' ? 'हटाने में त्रुटि।' : 'Error deleting.') } finally { setActing(null) }
  }

  /* ── Blog actions ── */
  const publishBlog = async (id) => {
    setActing(id)
    try {
      await blogService.publishBlog(id)
      setBlogs(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, status: 'published' } : b))
      toast.success(lang === 'hi' ? 'प्रकाशित किया!' : 'Published!')
    } catch { toast.error('Error') } finally { setActing(null) }
  }
  const unpublishBlog = async (id) => {
    setActing(id)
    try {
      await blogService.unpublishBlog(id)
      setBlogs(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, status: 'draft' } : b))
      toast.success(lang === 'hi' ? 'अप्रकाशित किया!' : 'Unpublished!')
    } catch { toast.error('Error') } finally { setActing(null) }
  }
  const deleteBlog = async (id) => {
    if (!confirm(lang === 'hi' ? 'क्या आप वाकई हटाना चाहते हैं?' : 'Are you sure?')) return
    setActing(id)
    try {
      await blogService.deleteBlog(id)
      setBlogs(prev => prev.filter(b => b.id !== id && b._id !== id))
      toast.success(lang === 'hi' ? 'हटाया गया!' : 'Deleted!')
    } catch { toast.error(lang === 'hi' ? 'हटाने में त्रुटि।' : 'Error deleting.') } finally { setActing(null) }
  }

  /* ── row renderers ── */
  const ActionBtn = ({ onClick, loading: busy, danger, icon: Icon, label }) => (
    <button
      onClick={onClick}
      disabled={busy}
      title={label}
      className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${
        danger
          ? 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
          : 'text-gold-600 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20'
      }`}
    >
      {busy ? <span className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin block" />
             : <Icon className="w-4 h-4" />}
    </button>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 hindi-text">
            {t('manageContent')}
          </h1>
          <p className="text-ink-400 dark:text-ink-300 mt-1 hindi-text text-sm">
            {lang === 'hi' ? 'अपनी कहानियाँ और ब्लॉग प्रबंधित करें' : 'Manage your stories and blogs'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/create-story" className="btn-secondary text-sm hindi-text">
            <HiBookOpen className="w-4 h-4" />
            {t('createStory')}
          </Link>
          <Link to="/admin/create-post" className="btn-primary text-sm hindi-text">
            <HiPencilAlt className="w-4 h-4" />
            {t('createPost')}
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'stories', label: lang === 'hi' ? `कहानियाँ (${stories.length})` : `Stories (${stories.length})` },
          { key: 'blogs',   label: lang === 'hi' ? `ब्लॉग (${blogs.length})`   : `Blogs (${blogs.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all hindi-text ${
              tab === key
                ? 'bg-gold-500 text-white shadow-golden'
                : 'bg-white dark:bg-ink-800 text-ink-500 dark:text-ink-200 shadow-card'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-ink-400 hindi-text">{t('loading')}</div>
      ) : tab === 'stories' ? (
        /* ── Stories ── */
        <div className="space-y-3">
          {stories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-ink-400 hindi-text mb-4">{lang === 'hi' ? 'कोई कहानी नहीं।' : 'No stories yet.'}</p>
              <Link to="/admin/create-story" className="btn-primary">{t('createStory')}</Link>
            </div>
          ) : stories.map((story, i) => {
            const sid    = story.id || story._id
            const isBusy = acting === sid
            return (
              <motion.div
                key={sid}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-card flex items-center gap-4"
              >
                {story.coverImage && (
                  <img src={story.coverImage} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0"
                    onError={(e) => e.currentTarget.style.display = 'none'} />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-700 dark:text-ink-50 hindi-text truncate">
                    {lang === 'hi' ? (story.titleHi || story.title) : (story.titleEn || story.title)}
                  </h3>
                  <p className="text-xs text-ink-400 dark:text-ink-300 hindi-text mt-0.5">
                    {story.totalParts ?? '?'} {t('parts')} · {(story.readCount / 1000).toFixed(1)}k reads · {formatDate(story.publishedAt, lang)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`tag text-xs hindi-text mr-2 ${
                    story.status === 'published' || story.status === 'published'
                      ? 'tag-gold'
                      : story.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-cream-200 dark:bg-ink-600 text-ink-400'
                  }`}>
                    {story.status === 'published'   ? (lang === 'hi' ? 'जारी' : 'published')
                     : story.status === 'completed' ? (lang === 'hi' ? 'पूर्ण' : 'Done')
                     : (lang === 'hi' ? 'ड्राफ्ट' : 'Draft')}
                  </span>

                  {/* Manage Parts link */}
                  <Link
                    to={`/admin/story/${sid}/parts`}
                    title={lang === 'hi' ? 'भाग प्रबंधित करें' : 'Manage Parts'}
                    className="p-2 rounded-lg text-ink-400 dark:text-ink-300 hover:bg-cream-100 dark:hover:bg-ink-600 hover:text-ink-700 dark:hover:text-ink-50 transition-colors"
                  >
                    <HiViewList className="w-4 h-4" />
                  </Link>

                  {story.status === 'draft'
                    ? <ActionBtn onClick={() => publishStory(sid)}   loading={isBusy} icon={HiEye}    label="Publish" />
                    : <ActionBtn onClick={() => unpublishStory(sid)} loading={isBusy} icon={HiEyeOff} label="Unpublish" />
                  }
                  <ActionBtn onClick={() => deleteStory(sid)} loading={isBusy} danger icon={HiTrash} label="Delete" />
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        /* ── Blogs ── */
        <div className="space-y-3">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-ink-400 hindi-text mb-4">{lang === 'hi' ? 'कोई ब्लॉग नहीं।' : 'No blogs yet.'}</p>
              <Link to="/admin/create-post" className="btn-primary">{t('createPost')}</Link>
            </div>
          ) : blogs.map((blog, i) => {
            const bid    = blog.id || blog._id
            const isBusy = acting === bid
            return (
              <motion.div
                key={bid}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-card flex items-center gap-4"
              >
                <img src={blog.coverImage} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0"
                  onError={(e) => e.currentTarget.style.display = 'none'} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-700 dark:text-ink-50 hindi-text truncate">
                    {lang === 'hi' ? (blog.titleHi || blog.title) : (blog.titleEn || blog.title)}
                  </h3>
                  <p className="text-xs text-ink-400 dark:text-ink-300 hindi-text mt-0.5">
                    {blog.readingTimeMin} min · {blog.likeCount} likes · {formatDate(blog.publishedAt, lang)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`tag text-xs hindi-text mr-1 ${
                    blog.status === 'published' ? 'tag-gold' : 'bg-cream-200 dark:bg-ink-600 text-ink-400'
                  }`}>
                    {blog.status === 'published' ? (lang === 'hi' ? 'प्रकाशित' : 'Published') : (lang === 'hi' ? 'ड्राफ्ट' : 'Draft')}
                  </span>

                  {blog.status !== 'published'
                    ? <ActionBtn onClick={() => publishBlog(bid)}   loading={isBusy} icon={HiEye}    label="Publish" />
                    : <ActionBtn onClick={() => unpublishBlog(bid)} loading={isBusy} icon={HiEyeOff} label="Unpublish" />
                  }
                  <ActionBtn onClick={() => deleteBlog(bid)} loading={isBusy} danger icon={HiTrash} label="Delete" />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

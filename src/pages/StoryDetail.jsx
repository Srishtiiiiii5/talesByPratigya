import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiBookOpen, HiHeart, HiEye, HiClock, HiChevronRight, HiBell } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { storyService } from '../services/storyService'
import { DetailSkeleton } from '../components/common/LoadingSkeleton'
import { isFollowing, toggleFollow, getLastReadPart, isLiked, toggleLike, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function StoryDetail() {
  const { id }      = useParams()
  const { lang, t } = useLanguage()
  const { user }    = useAuth()

  const [story,     setStory]     = useState(null)
  const [parts,     setParts]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [following, setFollowing] = useState(false)
  const [liked,     setLiked]     = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([storyService.getStory(id), storyService.getParts(id)])
      .then(([s, p]) => {
        setStory(s)
        setParts(p)
        setFollowing(isFollowing(id))
        setLiked(isLiked('story', id))
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleFollow = async () => {
    if (!user) { toast.error(lang === 'hi' ? 'फ़ॉलो करने के लिए लॉगिन करें।' : 'Login to follow.'); return }
    const next = !following
    setFollowing(next)
    toggleFollow(id)   // localStorage sync
    try {
      if (next) {
        await storyService.followStory(id)
        toast.success(t('following'))
      } else {
        await storyService.unfollowStory(id)
        toast.success(lang === 'hi' ? 'अनफ़ॉलो किया।' : 'Unfollowed.')
      }
    } catch {
      // API unavailable — localStorage state already toggled, no rollback needed
    }
  }

  const handleLike = async () => {
    if (!user) { toast.error(t('loginToLike')); return }
    const next = !liked
    setLiked(next)
    toggleLike('story', id)   // localStorage sync
    try {
      if (next) {
        await storyService.likeStory(id)
      } else {
        await storyService.unlikeStory(id)
      }
    } catch {
      // API unavailable — optimistic update kept
    }
  }

  if (loading) return <DetailSkeleton />
  if (!story)  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl hindi-text text-ink-400">{t('notFound')}</p>
        <Link to="/stories" className="btn-primary mt-4 inline-flex">{t('allStories')}</Link>
      </div>
    </div>
  )

  const title       = lang === 'hi' ? story.titleHi    : story.titleEn
  const description = lang === 'hi' ? story.descriptionHi : story.descriptionEn
  const genre       = lang === 'hi' ? story.genreHi    : story.genreEn
  const lastRead    = getLastReadPart(id)
  const firstPart   = parts[0]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative h-80 sm:h-96 overflow-hidden">
        {story.coverImage ? (
          <img src={story.coverImage} alt={title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display='none'} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink-800 to-gold-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-story-light dark:from-story-dark via-black/40 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        {/* Story meta card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-8 mb-10"
        >
          {/* Genre tag */}
          <span className="tag tag-gold hindi-text text-sm mb-4 inline-block">{genre}</span>

          {/* Title */}
          <h1 className="hindi-text font-serif text-3xl sm:text-4xl font-bold text-ink-700 dark:text-ink-50 leading-tight mb-2">
            {title}
          </h1>
          {story.subtitleHi && (
            <p className="hindi-text text-gold-600 dark:text-gold-400 text-lg mb-1">
              {lang === 'hi' ? story.subtitleHi : story.subtitleEn}
            </p>
          )}

          {/* Author & date */}
          <p className="text-sm text-ink-400 dark:text-ink-300 mb-6 hindi-text">
            {t('by')} <span className="font-semibold text-ink-600 dark:text-ink-100">{story.author.name}</span>
            {' · '}
            {formatDate(story.publishedAt, lang)}
          </p>

          {/* Description */}
          <p className="hindi-text text-ink-500 dark:text-ink-200 leading-relaxed mb-8 text-base">
            {description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-5 text-sm text-ink-400 dark:text-ink-300 mb-8">
            <span className="flex items-center gap-1.5 hindi-text">
              <HiBookOpen className="w-4 h-4 text-gold-500" />
              {parts.length} {t('parts')}
            </span>
            <span className="flex items-center gap-1.5">
              <HiEye className="w-4 h-4 text-gold-500" />
              {(story.readCount / 1000).toFixed(1)}k
            </span>
            <span className={`flex items-center gap-1.5 cursor-pointer transition-colors ${liked ? 'text-red-500' : ''}`} onClick={handleLike}>
              <HiHeart className={`w-4 h-4 ${liked ? 'text-red-500' : 'text-gold-500'}`} />
              {(story.likeCount / 1000).toFixed(1)}k
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {lastRead ? (
              <Link to={`/stories/${id}/read/${lastRead}`} className="btn-primary hindi-text">
                <HiBookOpen className="w-4 h-4" />
                {t('continueReading')}
              </Link>
            ) : firstPart ? (
              <Link to={`/stories/${id}/read/${firstPart.id}`} className="btn-primary hindi-text">
                <HiBookOpen className="w-4 h-4" />
                {t('readNow')}
              </Link>
            ) : null}

            <button
              onClick={handleFollow}
              className={`btn-secondary hindi-text ${following ? '!bg-gold-500 !text-white' : ''}`}
            >
              <HiBell className="w-4 h-4" />
              {following ? t('following') : t('followStory')}
            </button>
          </div>
        </motion.div>

        {/* Parts list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="hindi-text font-serif text-2xl font-bold text-ink-700 dark:text-ink-50 mb-6">
            {lang === 'hi' ? 'सभी भाग' : 'All Parts'}
          </h2>

          <div className="space-y-3 mb-16">
            {parts.map((part, idx) => (
              <Link
                key={part.id}
                to={`/stories/${id}/read/${part.id}`}
                className="block card p-4 sm:p-5 hover:shadow-golden transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-4">
                  {/* Part number */}
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                    <span className="text-gold-600 dark:text-gold-400 font-serif font-bold text-sm">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Part info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="hindi-text font-semibold text-ink-700 dark:text-ink-50 truncate">
                      {lang === 'hi' ? (part.titleHi || part.title) : (part.titleEn || part.titleHi || part.title)}
                    </h3>
                    {part.summary && (
                      <p className="hindi-text text-xs text-ink-400 dark:text-ink-300 mt-1 line-clamp-1">
                        {part.summary}
                      </p>
                    )}
                  </div>

                  {/* Reading time & arrow */}
                  <div className="flex items-center gap-3 shrink-0 text-ink-300 dark:text-ink-400 text-xs">
                    <span className="flex items-center gap-1 hidden sm:flex">
                      <HiClock className="w-3.5 h-3.5" />
                      {part.readingTimeMin} {t('minutes')}
                    </span>
                    <HiChevronRight className="w-4 h-4 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

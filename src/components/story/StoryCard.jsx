import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiBookOpen, HiHeart, HiEye } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { coverGradient } from '../../utils/helpers'

export default function StoryCard({ story, index = 0 }) {
  const { lang, t } = useLanguage()

  // Support backend (title/description/group) and normalised (titleHi/genreHi) shapes
  const title       = lang === 'hi'
    ? (story.titleHi       || story.title       || '')
    : (story.titleEn       || story.titleHi     || story.title || '')

  const description = lang === 'hi'
    ? (story.descriptionHi || story.description || '')
    : (story.descriptionEn || story.descriptionHi || story.description || '')

  const genre       = lang === 'hi'
    ? (story.genreHi       || story.group       || '')
    : (story.genreEn       || story.genreHi     || story.group || '')

  const storyId = story.id || story._id

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link to={`/stories/${storyId}`} className="block group">
        <article className="card card-hover h-full flex flex-col">
          {/* Cover */}
          <div className="relative overflow-hidden h-56">
            {story.coverImage ? (
              <img
                src={story.coverImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${coverGradient(index)} flex items-end p-5`}>
                <span className="hindi-text text-2xl font-bold text-white/90 font-serif leading-tight">
                  {title}
                </span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Status badge */}
            <span className={`absolute top-3 right-3 tag text-xs ${
              story.status === 'completed' ? 'bg-green-100 text-green-700' : 'tag-gold'
            }`}>
              {story.status === 'completed'
                ? (lang === 'hi' ? 'पूर्ण' : 'Complete')
                : (lang === 'hi' ? 'जारी' : 'published')}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {genre && (
              <p className="text-xs text-gold-600 dark:text-gold-400 font-medium mb-2 hindi-text">
                {genre}
              </p>
            )}

            <h3 className="font-serif text-lg font-bold text-ink-700 dark:text-ink-50 leading-snug mb-2 hindi-text line-clamp-2">
              {title}
            </h3>

            <p className="hindi-text text-sm text-ink-400 dark:text-ink-300 leading-relaxed line-clamp-3 flex-1">
              {description}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200 dark:border-ink-600 text-xs text-ink-300 dark:text-ink-400">
              <div className="flex items-center gap-3">
                {story.totalParts > 0 && (
                  <span className="flex items-center gap-1">
                    <HiBookOpen className="w-3.5 h-3.5" />
                    {story.totalParts} {t('parts')}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <HiEye className="w-3.5 h-3.5" />
                  {((story.readCount || 0) / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <HiHeart className="w-3.5 h-3.5" />
                  {((story.likeCount || 0) / 1000).toFixed(1)}k
                </span>
              </div>
              <span className="hindi-text">{t('readNow')} →</span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

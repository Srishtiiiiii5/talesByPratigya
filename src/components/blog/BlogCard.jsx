import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHeart, HiClock } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { formatDate } from '../../utils/helpers'

export default function BlogCard({ blog, index = 0 }) {
  const { lang, t } = useLanguage()

  // Support backend (title/content) and normalised (titleHi/excerptHi) shapes
  const title    = lang === 'hi'
    ? (blog.titleHi    || blog.title    || '')
    : (blog.titleEn    || blog.titleHi  || blog.title || '')

  const excerpt  = lang === 'hi'
    ? (blog.excerptHi  || blog.excerpt  || '')
    : (blog.excerptEn  || blog.excerptHi || blog.excerpt || '')

  const category = lang === 'hi'
    ? (blog.categoryHi || blog.category || blog.group || '')
    : (blog.categoryEn || blog.category || blog.group || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link to={`/blogs/${blog.id || blog._id}`} className="block group">
        <article className="card card-hover h-full flex flex-col">
          {/* Cover */}
          <div className="relative overflow-hidden h-48">
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.parentElement.classList.add('bg-gradient-to-br', 'from-ink-700', 'to-gold-700')
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ink-700 to-gold-700 flex items-end p-4">
                <span className="hindi-text text-lg font-bold text-white/90 font-serif line-clamp-2">
                  {title}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {category && (
              <span className="absolute bottom-3 left-3 tag tag-gold text-xs hindi-text">
                {category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-serif text-lg font-bold text-ink-700 dark:text-ink-50 leading-snug mb-2 hindi-text line-clamp-2">
              {title}
            </h3>

            <p className="hindi-text text-sm text-ink-400 dark:text-ink-300 leading-relaxed line-clamp-3 flex-1">
              {excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200 dark:border-ink-600 text-xs text-ink-300 dark:text-ink-400">
              <div className="flex items-center gap-3">
                {blog.readingTimeMin > 0 && (
                  <span className="flex items-center gap-1">
                    <HiClock className="w-3.5 h-3.5" />
                    {blog.readingTimeMin} {t('minutes')}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <HiHeart className="w-3.5 h-3.5" />
                  {blog.likeCount ?? 0}
                </span>
              </div>
              <span className="hindi-text text-gold-600 dark:text-gold-400 font-medium">
                {t('readMore')} →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

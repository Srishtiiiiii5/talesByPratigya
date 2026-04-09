import { Link } from 'react-router-dom'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'

export default function PartNavigation({ storyId, currentPart, parts }) {
  const { t } = useLanguage()

  const currentIndex = parts.findIndex(p => p.id === currentPart?.id)
  const prevPart     = parts[currentIndex - 1] ?? null
  const nextPart     = parts[currentIndex + 1] ?? null

  return (
    <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-cream-200 dark:border-ink-600">
      {prevPart ? (
        <Link
          to={`/stories/${storyId}/read/${prevPart.id}`}
          className="flex items-center gap-2 btn-secondary"
        >
          <HiChevronLeft className="w-4 h-4" />
          <span className="hindi-text text-sm hidden sm:inline">
            {t('prevPart')}: {prevPart.titleHi}
          </span>
          <span className="hindi-text text-sm sm:hidden">{t('prevPart')}</span>
        </Link>
      ) : (
        <div />
      )}

      <Link
        to={`/stories/${storyId}`}
        className="text-sm text-ink-400 dark:text-ink-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors hindi-text"
      >
        {t('tableOfContents')}
      </Link>

      {nextPart ? (
        <Link
          to={`/stories/${storyId}/read/${nextPart.id}`}
          className="flex items-center gap-2 btn-primary"
        >
          <span className="hindi-text text-sm hidden sm:inline">
            {t('nextPart')}: {nextPart.titleHi}
          </span>
          <span className="hindi-text text-sm sm:hidden">{t('nextPart')}</span>
          <HiChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

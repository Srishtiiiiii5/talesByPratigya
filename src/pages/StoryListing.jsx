import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { storyService } from '../services/storyService'
import StoryCard from '../components/story/StoryCard'
import { CardGridSkeleton } from '../components/common/LoadingSkeleton'

const GENRES = [
  { key: 'all',           hiLabel: 'सभी',        enLabel: 'All' },
  { key: 'historical',    hiLabel: 'ऐतिहासिक',   enLabel: 'Historical' },
  { key: 'romance',       hiLabel: 'रोमांस',      enLabel: 'Romance' },
  { key: 'supernatural',  hiLabel: 'अलौकिक',      enLabel: 'Supernatural' },
  { key: 'fantasy',       hiLabel: 'काल्पनिक',    enLabel: 'Fantasy' },
]

export default function StoryListing() {
  const { lang, t } = useLanguage()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [genre,   setGenre]   = useState('all')

  useEffect(() => {
    storyService.getStories()
      .then(res => setStories(res.data ?? res))
      .finally(() => setLoading(false))
  }, [])

  const filtered = genre === 'all'
    ? stories
    : stories.filter(s => s.group === genre)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title hindi-text"
        >
          {t('allStories')}
        </motion.h1>
        <div className="gold-divider gold-divider-center" />
        <p className="hindi-text text-ink-400 dark:text-ink-300 mt-3">
          {lang === 'hi'
            ? 'प्रतिज्ञा सिंह की सभी कहानियाँ — एक जगह'
            : "All of Pratigya Singh's stories — in one place"}
        </p>
      </div>

      {/* Genre filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {GENRES.map(g => (
          <button
            key={g.key}
            onClick={() => setGenre(g.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hindi-text ${
              genre === g.key
                ? 'bg-gold-500 text-white shadow-golden'
                : 'bg-cream-100 dark:bg-ink-600 text-ink-500 dark:text-ink-200 hover:bg-cream-200 dark:hover:bg-ink-500'
            }`}
          >
            {lang === 'hi' ? g.hiLabel : g.enLabel}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <CardGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-400 dark:text-ink-300 hindi-text">
          {lang === 'hi' ? 'इस श्रेणी में कोई कहानी नहीं मिली।' : 'No stories found in this genre.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

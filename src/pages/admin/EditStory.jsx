import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiSave, HiChevronLeft } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { storyService } from '../../services/storyService'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'supernatural', hiLabel: 'अलौकिक',    enLabel: 'Supernatural' },
  { value: 'historical',   hiLabel: 'ऐतिहासिक',   enLabel: 'Historical' },
  { value: 'romance',      hiLabel: 'रोमांस',      enLabel: 'Romance' },
  { value: 'fantasy',      hiLabel: 'काल्पनिक',    enLabel: 'Fantasy' },
  { value: 'drama',        hiLabel: 'नाटक',        enLabel: 'Drama' },
  { value: 'spiritual',    hiLabel: 'आध्यात्मिक',  enLabel: 'Spiritual' },
]

export default function EditStory() {
  const { lang, t } = useLanguage()
  const navigate    = useNavigate()
  const { id }      = useParams()

  const [story, setStory] = useState({
    title:       '',
    description: '',
    coverImage:  '',
    category:    'romance',
    tags:        '',
  })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  // Load existing story
  useEffect(() => {
    if (id) {
      setLoading(true)
      storyService.getAdminStory(id)
        .then(data => {
          if (data) {
            setStory({
              title:       data.titleHi || data.titleEn || data.title || '',
              description: data.descriptionHi || data.descriptionEn || data.description || '',
              coverImage:  data.coverImage || '',
              category:    data.category || data.group || 'romance',
              tags:        data.tags ? data.tags.join(', ') : '',
            })
          }
        })
        .catch(() => toast.error(lang === 'hi' ? 'कहानी लोड करने में त्रुटि।' : 'Error loading story.'))
        .finally(() => setLoading(false))
    }
  }, [id, lang])

  const setS = (key) => (e) => setStory(f => ({ ...f, [key]: e.target?.value ?? e }))

  const handleSave = async () => {
    if (!story.title.trim()) {
      toast.error(lang === 'hi' ? 'कहानी का शीर्षक जरूरी है।' : 'Story title is required.')
      return
    }

    setSaving(true)
    try {
      await storyService.updateStory(id, {
        title:       story.title,
        description: story.description,
        coverImage:  story.coverImage,
        category:    story.category,
        tags:        story.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      })

      toast.success(lang === 'hi' ? 'कहानी अपडेट हुई!' : 'Story updated!')
      navigate('/admin/manage')
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === 'hi' ? 'अपडेट फेल हो गया।' : 'Update failed.'))
    } finally {
      setSaving(false)
    }
  }

  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-ink-600 dark:text-ink-200 mb-1.5 hindi-text">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )

  if (loading) {
    return <div className="text-center py-20 text-ink-400 hindi-text">{t('loading') || 'Loading...'}</div>
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/admin/manage')}
            className="inline-flex items-center gap-1.5 text-sm text-ink-400 dark:text-ink-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors mb-2"
          >
            <HiChevronLeft className="w-4 h-4" />
            {lang === 'hi' ? 'वापस' : 'Back'}
          </button>
          <h1 className="font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 hindi-text">
            {lang === 'hi' ? 'कहानी संपादित करें' : 'Edit Story'}
          </h1>
          <p className="text-ink-400 dark:text-ink-300 mt-1 hindi-text text-sm">
            {lang === 'hi'
              ? 'कहानी का विवरण अपडेट करें'
              : 'Update story details'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm hindi-text disabled:opacity-60"
          >
            {saving
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> ...</span>
              : <><HiSave className="w-4 h-4" /> {lang === 'hi' ? 'सेव करें' : 'Save Changes'}</>
            }
          </button>
        </div>
      </div>

      {/* Main form */}
      <motion.div
        key="story-meta-edit"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
            <Label required>
              {lang === 'hi' ? 'कहानी का शीर्षक (हिंदी में)' : 'Story Title (in Hindi)'}
            </Label>
            <input
              value={story.title}
              onChange={setS('title')}
              placeholder={lang === 'hi' ? 'जैसे: साम्राज्ञी' : 'e.g. साम्राज्ञी'}
              className="input-field hindi-text text-xl font-semibold"
            />
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
            <Label>
              {lang === 'hi' ? 'कहानी का विवरण' : 'Story Description'}
            </Label>
            <textarea
              value={story.description}
              onChange={setS('description')}
              rows={5}
              placeholder={lang === 'hi' ? 'कहानी का संक्षिप्त विवरण...' : 'Brief story description…'}
              className="input-field resize-none hindi-text"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
            <Label>{t('coverImage')}</Label>
            <ImageUpload
              value={story.coverImage}
              onChange={(url) => setStory(s => ({ ...s, coverImage: url }))}
            />
          </div>

          {/* Category / Tags */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card space-y-4">
            <div>
              <Label>{lang === 'hi' ? 'श्रेणी (Category)' : 'Category'}</Label>
              <select value={story.category} onChange={setS('category')} className="input-field hindi-text">
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {lang === 'hi' ? c.hiLabel : c.enLabel}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>{t('tags')}</Label>
              <input
                value={story.tags}
                onChange={setS('tags')}
                placeholder="historical, romance, gupta"
                className="input-field"
              />
              <p className="text-xs text-ink-300 mt-1 hindi-text">
                {lang === 'hi' ? 'कॉमा से अलग करें' : 'Comma separated'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

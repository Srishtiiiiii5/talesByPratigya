import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiTrash, HiSave, HiEye } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { storyService } from '../../services/storyService'
import RichTextEditor from '../../components/editor/RichTextEditor'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

/*
 * Backend story body  : { title, description, coverImage, group, status }
 * Backend part body   : { partNumber, title, content, bannerImage }
 */

const CATEGORIES = [
  { value: 'supernatural', hiLabel: 'अलौकिक',    enLabel: 'Supernatural' },
  { value: 'historical',   hiLabel: 'ऐतिहासिक',   enLabel: 'Historical' },
  { value: 'romance',      hiLabel: 'रोमांस',      enLabel: 'Romance' },
  { value: 'fantasy',      hiLabel: 'काल्पनिक',    enLabel: 'Fantasy' },
  { value: 'drama',        hiLabel: 'नाटक',        enLabel: 'Drama' },
  { value: 'spiritual',    hiLabel: 'आध्यात्मिक',  enLabel: 'Spiritual' },
]

const emptyPart = (n) => ({ partNumber: n, title: '', content: '', bannerImage: '' })

export default function CreateStory() {
  const { lang, t } = useLanguage()
  const navigate    = useNavigate()

  const [story, setStory] = useState({
    title:       '',
    description: '',
    coverImage:  '',
    category:    'romance',
    tags:        '',
  })
  const [parts,     setParts]     = useState([emptyPart(1)])
  const [activeTab, setActiveTab] = useState(0)   // 0 = story meta, 1+ = parts
  const [saving,    setSaving]    = useState(false)

  /* ── field setters ── */
  const setS = (key) => (e) => setStory(f => ({ ...f, [key]: e.target?.value ?? e }))
  const setP = (idx, key) => (e) => {
    const val = e.target?.value ?? e
    setParts(prev => prev.map((p, i) => i === idx ? { ...p, [key]: val } : p))
  }

  const addPart = () => {
    setParts(prev => [...prev, emptyPart(prev.length + 1)])
    setActiveTab(parts.length + 1)
  }

  const removePart = (idx) => {
    if (parts.length === 1) {
      toast.error(lang === 'hi' ? 'कम से कम एक भाग जरूरी है।' : 'At least one part required.')
      return
    }
    setParts(prev => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, partNumber: i + 1 })))
    setActiveTab(Math.max(0, activeTab - 1))
  }

  /* ── save ── */
  const handleSave = async (publishStatus) => {
    if (!story.title.trim()) {
      toast.error(lang === 'hi' ? 'कहानी का शीर्षक जरूरी है।' : 'Story title is required.')
      return
    }

    setSaving(true)
    try {
      /* 1. Create the story */
      const newStory = await storyService.createStory({
        title:       story.title,
        description: story.description,
        coverImage:  story.coverImage,
        category:    story.category,
        status:      publishStatus,
        tags:        story.tags.split(',').map(t => t.trim()).filter(Boolean),
      })

      const storyId = newStory._id ?? newStory.id

      /* 2. Create each part (skip if no title) */
      const validParts = parts.filter(p => p.title.trim())
      if (validParts.length > 0 && storyId) {
        await Promise.all(
          validParts.map(p =>
            storyService.createPart(storyId, {
              partNumber:  p.partNumber,
              title:       p.title,
              content:     p.content,
              bannerImage: p.bannerImage,
            })
          )
        )
      }

      toast.success(
        publishStatus === 'published'
          ? (lang === 'hi' ? 'कहानी प्रकाशित हुई! ✨' : 'Story published! ✨')
          : (lang === 'hi' ? 'ड्राफ्ट सेव हुआ!' : 'Draft saved!')
      )
      navigate('/admin/manage')
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === 'hi' ? 'कुछ गड़बड़ हुई। ' : 'Something went wrong.'))
    } finally {
      setSaving(false)
    }
  }

  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-ink-600 dark:text-ink-200 mb-1.5 hindi-text">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )

  const tabs = [
    lang === 'hi' ? 'कहानी विवरण' : 'Story Info',
    ...parts.map((_, i) => `${lang === 'hi' ? 'भाग' : 'Part'} ${i + 1}`),
  ]

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 hindi-text">
            {t('createStory')}
          </h1>
          <p className="text-ink-400 dark:text-ink-300 mt-1 hindi-text text-sm">
            {lang === 'hi'
              ? 'नई कहानी बनाएँ और उसके भाग जोड़ें'
              : 'Create a new story and add its parts'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="btn-secondary text-sm hindi-text disabled:opacity-60"
          >
            <HiSave className="w-4 h-4" />
            {t('saveDraft')}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="btn-primary text-sm hindi-text disabled:opacity-60"
          >
            {saving
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> ...</span>
              : <><HiEye className="w-4 h-4" /> {t('publishPost')}</>
            }
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6 border-b border-cream-200 dark:border-ink-600 pb-3">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-t-xl text-sm font-medium transition-colors hindi-text ${
              activeTab === i
                ? 'bg-gold-500 text-white'
                : 'text-ink-500 dark:text-ink-300 hover:bg-cream-100 dark:hover:bg-ink-600'
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={addPart}
          className="px-4 py-2 rounded-t-xl text-sm font-medium text-gold-600 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors flex items-center gap-1.5"
        >
          <HiPlus className="w-4 h-4" />
          {t('addPart')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Story meta tab ── */}
        {activeTab === 0 && (
          <motion.div
            key="story-meta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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
        )}

        {/* ── Part tabs ── */}
        {activeTab > 0 && (() => {
          const idx  = activeTab - 1
          const part = parts[idx]
          return (
            <motion.div
              key={`part-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Part header */}
              <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-ink-700 dark:text-ink-50 hindi-text text-lg">
                    {lang === 'hi' ? `भाग ${part.partNumber}` : `Part ${part.partNumber}`}
                  </h2>
                  <button
                    onClick={() => removePart(idx)}
                    className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title={lang === 'hi' ? 'भाग हटाएँ' : 'Remove part'}
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label required>
                      {lang === 'hi' ? 'भाग का शीर्षक (हिंदी में)' : 'Part Title (in Hindi)'}
                    </Label>
                    <input
                      value={part.title}
                      onChange={setP(idx, 'title')}
                      placeholder={lang === 'hi' ? `भाग ${part.partNumber} का शीर्षक` : `Part ${part.partNumber} title`}
                      className="input-field hindi-text font-semibold"
                    />
                  </div>

                  <div>
                    <Label>{lang === 'hi' ? 'बैनर चित्र (वैकल्पिक)' : 'Banner Image (optional)'}</Label>
                    <ImageUpload
                      value={part.bannerImage}
                      onChange={(url) => {
                         const e = { target: { value: url } };
                         setP(idx, 'bannerImage')(e);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Part content */}
              <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
                <Label required>
                  {lang === 'hi' ? 'भाग की सामग्री' : 'Part Content'}
                </Label>
                <RichTextEditor
                  value={part.content}
                  onChange={setP(idx, 'content')}
                  placeholder={lang === 'hi' ? 'यहाँ कहानी लिखें...' : 'Write the story here…'}
                />
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

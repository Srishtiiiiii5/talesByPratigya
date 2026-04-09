import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiUpload, HiEye, HiSave } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { blogService } from '../../services/blogService'
import RichTextEditor from '../../components/editor/RichTextEditor'
import toast from 'react-hot-toast'

// These map to the backend's `category` / `group` field
const CATEGORIES = [
  { value: 'sahitya',   hiLabel: 'साहित्य',   enLabel: 'Literature' },
  { value: 'history',   hiLabel: 'इतिहास',    enLabel: 'History' },
  { value: 'writing',   hiLabel: 'लेखन',      enLabel: 'Writing' },
  { value: 'travel',    hiLabel: 'यात्रा',     enLabel: 'Travel' },
  { value: 'culture',   hiLabel: 'संस्कृति',   enLabel: 'Culture' },
  { value: 'mythology', hiLabel: 'पौराणिक',   enLabel: 'Mythology' },
]

export default function CreatePost() {
  const { lang, t } = useLanguage()
  const navigate    = useNavigate()

  /*
   * Backend blog body: { title, content, coverImage, status }
   * We store title and content directly (Hindi text).
   * Tags and category are additional metadata.
   */
  const [form, setForm] = useState({
    title:      '',      // Hindi title (backend "title" field)
    content:    '',      // Hindi HTML content
    coverImage: '',
    category:   'sahitya',
    tags:       '',
  })
  const [preview, setPreview] = useState(false)
  const [saving,  setSaving]  = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target?.value ?? e }))

  const handleSubmit = async (status) => {
    if (!form.title.trim()) {
      toast.error(lang === 'hi' ? 'शीर्षक जरूरी है।' : 'Title is required.')
      return
    }
    if (!form.content.replace(/<[^>]*>/g, '').trim()) {
      toast.error(lang === 'hi' ? 'सामग्री जरूरी है।' : 'Content is required.')
      return
    }
    setSaving(true)
    try {
      await blogService.createBlog({
        title:      form.title,
        content:    form.content,
        coverImage: form.coverImage,
        category:   form.category,
        tags:       form.tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
      })
      toast.success(
        status === 'published'
          ? (lang === 'hi' ? 'ब्लॉग प्रकाशित हुआ! ✨' : 'Blog published! ✨')
          : (lang === 'hi' ? 'ड्राफ्ट सेव हुआ!' : 'Draft saved!')
      )
      navigate('/admin/manage')
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === 'hi' ? 'कुछ गड़बड़ हुई।' : 'Something went wrong.'))
    } finally {
      setSaving(false)
    }
  }

  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-ink-600 dark:text-ink-200 mb-1.5 hindi-text">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 hindi-text">
            {t('createPost')}
          </h1>
          <p className="text-ink-400 dark:text-ink-300 mt-1 hindi-text text-sm">
            {lang === 'hi' ? 'नया ब्लॉग पोस्ट लिखें' : 'Write a new blog post'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(v => !v)}
            className="btn-ghost text-sm hindi-text"
          >
            <HiEye className="w-4 h-4" />
            {preview ? (lang === 'hi' ? 'एडिट करें' : 'Edit') : (lang === 'hi' ? 'प्रिव्यू' : 'Preview')}
          </button>
        </div>
      </div>

      {preview ? (
        /* ── Preview mode ── */
        <motion.div
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-ink-800 rounded-2xl shadow-card p-8 max-w-3xl"
        >
          {form.coverImage && (
            <img src={form.coverImage} alt="" className="w-full h-64 object-cover rounded-xl mb-6"
              onError={(e) => e.currentTarget.style.display = 'none'} />
          )}
          <h1 className="hindi-text font-serif text-3xl font-bold text-ink-800 dark:text-ink-50 mb-4">
            {form.title || (lang === 'hi' ? '(शीर्षक)' : '(Title)')}
          </h1>
          <div
            className="prose-story hindi-text text-ink-700 dark:text-ink-100"
            style={{ fontSize: '1.05rem', lineHeight: 2 }}
            dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:#aaa">Content will appear here…</p>' }}
          />
        </motion.div>
      ) : (
        /* ── Edit mode ── */
        <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
              <Label required>
                {lang === 'hi' ? 'ब्लॉग शीर्षक (हिंदी में लिखें)' : 'Blog Title (write in Hindi)'}
              </Label>
              <input
                value={form.title}
                onChange={set('title')}
                placeholder={lang === 'hi' ? 'जैसे: हिंदी साहित्य की अदृश्य शक्ति' : 'e.g. हिंदी साहित्य की अदृश्य शक्ति'}
                className="input-field hindi-text text-lg font-semibold"
              />
            </div>

            {/* Rich text content */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
              <Label required>
                {lang === 'hi' ? 'ब्लॉग की सामग्री' : 'Blog Content'}
              </Label>
              <RichTextEditor
                value={form.content}
                onChange={set('content')}
                placeholder={ 'Write your blog here…'}
              />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Cover image */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card">
              <Label>{t('coverImage')}</Label>
              {form.coverImage ? (
                <div>
                  <img
                    src={form.coverImage}
                    alt="cover"
                    className="w-full h-40 object-cover rounded-xl mb-3"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                  <button
                    onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    {lang === 'hi' ? 'हटाएँ' : 'Remove'}
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-cream-300 dark:border-ink-500 rounded-xl p-5 text-center mb-3">
                  <HiUpload className="w-7 h-7 text-ink-300 mx-auto mb-2" />
                  <p className="text-xs text-ink-400 hindi-text">
                    {lang === 'hi' ? 'URL दर्ज करें या एडिटर में अपलोड करें' : 'Enter URL or upload via editor'}
                  </p>
                </div>
              )}
              <input
                value={form.coverImage}
                onChange={set('coverImage')}
                placeholder="https://example.com/image.jpg"
                className="input-field text-sm"
              />
            </div>

            {/* Category & Tags */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card space-y-4">
              <div>
                <Label>{t('category')}</Label>
                <select value={form.category} onChange={set('category')} className="input-field hindi-text">
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
                  value={form.tags}
                  onChange={set('tags')}
                  placeholder="hindi, literature, history"
                  className="input-field"
                />
                <p className="text-xs text-ink-300 mt-1 hindi-text">
                  {lang === 'hi' ? 'कॉमा से अलग करें' : 'Comma separated'}
                </p>
              </div>
            </div>

            {/* Publish buttons */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card space-y-3">
              <button
                onClick={() => handleSubmit('published')}
                disabled={saving}
                className="btn-primary w-full justify-center hindi-text disabled:opacity-60"
              >
                {saving
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> ...</span>
                  : <><HiEye className="w-4 h-4" /> {t('publishPost')}</>
                }
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={saving}
                className="btn-secondary w-full justify-center hindi-text disabled:opacity-60"
              >
                <HiSave className="w-4 h-4" />
                {t('saveDraft')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

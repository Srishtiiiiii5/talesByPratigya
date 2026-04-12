import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronLeft, HiPlus, HiTrash, HiPencilAlt, HiX, HiSave, HiCheck } from 'react-icons/hi'
import { useLanguage } from '../../context/LanguageContext'
import { storyService } from '../../services/storyService'
import RichTextEditor from '../../components/editor/RichTextEditor'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

/*
 * Admin page to manage parts for an existing story.
 * Route: /admin/story/:storyId/parts
 *
 * Features:
 *  - Lists all parts from GET /stories/:storyId/parts
 *  - "Add New Part" inline form → POST /stories/:storyId/parts
 *  - Delete part → DELETE /stories/parts/:partId
 *  - Inline edit part title/content → PUT /stories/parts/:partId
 */

export default function ManageParts() {
  const { storyId }  = useParams()
  const { lang }     = useLanguage()

  const [story,      setStory]      = useState(null)
  const [parts,      setParts]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showAdd,    setShowAdd]    = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingId,  setEditingId]  = useState(null)  // partId being inline-edited

  // New part form state
  const [newPart, setNewPart] = useState({ title: '', content: '', bannerImage: '' })
  // Inline edit form state
  const [editForm, setEditForm] = useState({ title: '', content: '', bannerImage: '' })

  /* ── load ── */
  useEffect(() => {
    setLoading(true)
    Promise.all([storyService.getStory(storyId), storyService.getParts(storyId)])
      .then(([s, p]) => {
        setStory(s)
        setParts(p)
      })
      .catch(() => toast.error(lang === 'hi' ? 'डेटा लोड नहीं हो सका।' : 'Failed to load data.'))
      .finally(() => setLoading(false))
  }, [storyId])

  /* ── add part ── */
  const handleAddPart = async () => {
    if (!newPart.title.trim()) {
      toast.error(lang === 'hi' ? 'भाग का शीर्षक आवश्यक है।' : 'Part title is required.')
      return
    }
    setSaving(true)
    try {
      const partNumber = parts.length + 1
      const created = await storyService.createPart(storyId, {
        partNumber,
        title:       newPart.title.trim(),
        content:     newPart.content,
        bannerImage: newPart.bannerImage.trim(),
      })
      setParts(prev => [...prev, created])
      setNewPart({ title: '', content: '', bannerImage: '' })
      setShowAdd(false)
      toast.success(lang === 'hi' ? `भाग ${partNumber} जोड़ा गया! ✨` : `Part ${partNumber} added! ✨`)
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === 'hi' ? 'भाग नहीं जोड़ा जा सका।' : 'Could not add part.'))
    } finally {
      setSaving(false)
    }
  }

  /* ── delete part ── */
  const handleDelete = async (partId) => {
    if (!window.confirm(lang === 'hi' ? 'इस भाग को हटाना चाहते हैं?' : 'Delete this part?')) return
    setDeletingId(partId)
    try {
      await storyService.deletePart(partId)
      // Re-number remaining parts
      setParts(prev =>
        prev.filter(p => (p.id || p._id) !== partId)
            .map((p, i) => ({ ...p, partNumber: i + 1 }))
      )
      toast.success(lang === 'hi' ? 'भाग हटाया गया।' : 'Part deleted.')
    } catch {
      toast.error(lang === 'hi' ? 'हटाने में समस्या।' : 'Could not delete.')
    } finally {
      setDeletingId(null)
    }
  }

  /* ── start inline edit ── */
  const startEdit = (part) => {
    setEditingId(part.id || part._id)
    setEditForm({
      title:       part.titleHi || part.title || '',
      content:     part.content || '',
      bannerImage: part.bannerImage || '',
    })
  }

  /* ── save inline edit ── */
  const handleSaveEdit = async (partId) => {
    if (!editForm.title.trim()) {
      toast.error(lang === 'hi' ? 'शीर्षक आवश्यक है।' : 'Title is required.')
      return
    }
    setSaving(true)
    try {
      const updated = await storyService.updatePart(partId, {
        title:       editForm.title.trim(),
        content:     editForm.content,
        bannerImage: editForm.bannerImage.trim(),
      })
      setParts(prev => prev.map(p =>
        (p.id || p._id) === partId ? { ...p, ...updated } : p
      ))
      setEditingId(null)
      toast.success(lang === 'hi' ? 'भाग अपडेट हुआ!' : 'Part updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === 'hi' ? 'अपडेट नहीं हो सका।' : 'Update failed.'))
    } finally {
      setSaving(false)
    }
  }

  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-ink-600 dark:text-ink-200 mb-1.5 hindi-text">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )

  const storyTitle = story
    ? (lang === 'hi' ? (story.titleHi || story.title) : (story.titleEn || story.titleHi || story.title))
    : '...'

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/admin/manage"
            className="inline-flex items-center gap-1.5 text-sm text-ink-400 dark:text-ink-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors mb-2"
          >
            <HiChevronLeft className="w-4 h-4" />
            {lang === 'hi' ? 'सामग्री प्रबंधन' : 'Manage Content'}
          </Link>
          <h1 className="font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 hindi-text">
            {lang === 'hi' ? 'भाग प्रबंधन' : 'Manage Parts'}
          </h1>
          <p className="text-ink-400 dark:text-ink-300 mt-1 hindi-text text-sm">
            <span className="text-gold-600 dark:text-gold-400 font-semibold">{storyTitle}</span>
            {' · '}
            {parts.length} {lang === 'hi' ? 'भाग' : 'parts'}
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(v => !v); setEditingId(null) }}
          className="btn-primary text-sm hindi-text"
        >
          {showAdd ? <HiX className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
          {showAdd
            ? (lang === 'hi' ? 'रद्द करें' : 'Cancel')
            : (lang === 'hi' ? 'नया भाग जोड़ें' : 'Add New Part')}
        </button>
      </div>

      {/* Add Part Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="bg-gold-50 dark:bg-gold-900/10 border border-gold-200 dark:border-gold-800/40 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold">
                  {parts.length + 1}
                </div>
                <h3 className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">
                  {lang === 'hi' ? `नया भाग ${parts.length + 1}` : `New Part ${parts.length + 1}`}
                </h3>
              </div>

              <div>
                <Label required>{lang === 'hi' ? 'भाग का शीर्षक (हिंदी में)' : 'Part Title (in Hindi)'}</Label>
                <input
                  value={newPart.title}
                  onChange={e => setNewPart(p => ({ ...p, title: e.target.value }))}
                  placeholder={lang === 'hi' ? 'जैसे: घाट पर मुलाकात' : 'e.g. Meeting at the Ghat'}
                  className="input-field hindi-text font-semibold"
                  onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                />
              </div>

              <div>
                <Label>{lang === 'hi' ? 'बैनर चित्र URL (वैकल्पिक)' : 'Banner Image URL (optional)'}</Label>
                <ImageUpload
                  value={newPart.bannerImage}
                  onChange={(url) => setNewPart(p => ({ ...p, bannerImage: url }))}
                />
              </div>

              <div>
                <Label required>{lang === 'hi' ? 'भाग की सामग्री' : 'Part Content'}</Label>
                <RichTextEditor
                  value={newPart.content}
                  onChange={val => setNewPart(p => ({ ...p, content: val }))}
                  placeholder={lang === 'hi' ? 'यहाँ भाग की कहानी लिखें...' : 'Write the part content here…'}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => { setShowAdd(false); setNewPart({ title: '', content: '', bannerImage: '' }) }}
                  className="btn-secondary text-sm hindi-text"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  onClick={handleAddPart}
                  disabled={saving}
                  className="btn-primary text-sm hindi-text disabled:opacity-60"
                >
                  {saving
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> ...</span>
                    : <><HiSave className="w-4 h-4" /> {lang === 'hi' ? 'भाग सेव करें' : 'Save Part'}</>
                  }
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parts list */}
      {loading ? (
        <div className="text-center py-20 text-ink-400 hindi-text">
          {lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
        </div>
      ) : parts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink-400 dark:text-ink-300 hindi-text mb-4">
            {lang === 'hi' ? 'अभी कोई भाग नहीं है। ऊपर बटन से पहला भाग जोड़ें।' : 'No parts yet. Use the button above to add the first part.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {parts.map((part, i) => {
            const pid   = part.id || part._id
            const isEd  = editingId === pid
            const isDel = deletingId === pid
            const ptitle = part.titleHi || part.title || ''

            return (
              <motion.div
                key={pid}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-ink-800 rounded-2xl shadow-card overflow-hidden"
              >
                {/* Part header row */}
                <div className="flex items-center gap-4 p-5">
                  {/* Number bubble */}
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                    <span className="text-gold-600 dark:text-gold-400 font-serif font-bold text-sm">
                      {i + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3 className="hindi-text font-semibold text-ink-700 dark:text-ink-50 truncate">
                      {ptitle}
                    </h3>
                    <p className="text-xs text-ink-400 dark:text-ink-300 mt-0.5">
                      {part.readingTimeMin > 0 && `${part.readingTimeMin} min read`}
                      {part.publishedAt && ` · ${new Date(part.publishedAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!isEd && (
                      <button
                        onClick={() => startEdit(part)}
                        title={lang === 'hi' ? 'संपादित करें' : 'Edit'}
                        className="p-2 rounded-lg text-gold-600 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors"
                      >
                        <HiPencilAlt className="w-4 h-4" />
                      </button>
                    )}
                    {isEd && (
                      <>
                        <button
                          onClick={() => handleSaveEdit(pid)}
                          disabled={saving}
                          title={lang === 'hi' ? 'सेव करें' : 'Save'}
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-40"
                        >
                          {saving
                            ? <span className="w-4 h-4 border border-green-600 border-t-transparent rounded-full animate-spin block" />
                            : <HiCheck className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          title="Cancel"
                          className="p-2 rounded-lg text-ink-400 hover:bg-cream-100 dark:hover:bg-ink-700 transition-colors"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(pid)}
                      disabled={isDel}
                      title={lang === 'hi' ? 'हटाएँ' : 'Delete'}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors disabled:opacity-40"
                    >
                      {isDel
                        ? <span className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin block" />
                        : <HiTrash className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                {/* Inline edit form */}
                <AnimatePresence>
                  {isEd && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="border-t border-cream-100 dark:border-ink-600"
                    >
                      <div className="p-5 space-y-4 bg-cream-50 dark:bg-ink-700/50">
                        <div>
                          <label className="block text-sm font-medium text-ink-600 dark:text-ink-200 mb-1.5 hindi-text">
                            {lang === 'hi' ? 'शीर्षक' : 'Title'}<span className="text-red-400 ml-1">*</span>
                          </label>
                          <input
                            value={editForm.title}
                            onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                            className="input-field hindi-text font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink-600 dark:text-ink-200 mb-1.5">
                            {lang === 'hi' ? 'बैनर URL (वैकल्पिक)' : 'Banner URL (optional)'}
                          </label>
                          <ImageUpload
                            value={editForm.bannerImage}
                            onChange={(url) => setEditForm(f => ({ ...f, bannerImage: url }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink-600 dark:text-ink-200 mb-1.5 hindi-text">
                            {lang === 'hi' ? 'सामग्री' : 'Content'}
                          </label>
                          <RichTextEditor
                            value={editForm.content}
                            onChange={val => setEditForm(f => ({ ...f, content: val }))}
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button onClick={() => setEditingId(null)} className="btn-secondary text-sm">
                            {lang === 'hi' ? 'रद्द' : 'Cancel'}
                          </button>
                          <button
                            onClick={() => handleSaveEdit(pid)}
                            disabled={saving}
                            className="btn-primary text-sm disabled:opacity-60"
                          >
                            {saving
                              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> ...</span>
                              : <><HiSave className="w-4 h-4" /> {lang === 'hi' ? 'सेव करें' : 'Save'}</>
                            }
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Bottom add button if parts exist */}
      {!loading && parts.length > 0 && !showAdd && (
        <div className="mt-6 text-center">
          <button
            onClick={() => { setShowAdd(true); setEditingId(null) }}
            className="btn-secondary text-sm hindi-text"
          >
            <HiPlus className="w-4 h-4" />
            {lang === 'hi' ? `भाग ${parts.length + 1} जोड़ें` : `Add Part ${parts.length + 1}`}
          </button>
        </div>
      )}
    </div>
  )
}

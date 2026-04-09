import { useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
}

const formats = [
  'header', 'size',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'align',
  'blockquote', 'code-block',
  'link', 'image',
]

export default function RichTextEditor({ value, onChange, placeholder }) {
  const { t, lang } = useLanguage()
  const quillRef    = useRef(null)
  const [uploading, setUploading] = useState(false)

  /* ── Real image upload via POST /upload ────────────── */
  const handleImageUpload = () => {
    const input  = document.createElement('input')
    input.type   = 'file'
    input.accept = 'image/jpeg,image/png,image/gif,image/webp'

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      // 5 MB guard
      if (file.size > 5 * 1024 * 1024) {
        toast.error(lang === 'hi' ? 'छवि 5MB से कम होनी चाहिए।' : 'Image must be under 5 MB.')
        return
      }

      setUploading(true)
      try {
        /* Send as multipart/form-data with key "image" */
        const formData = new FormData()
        formData.append('image', file)

        let url
        try {
          const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          // Backend returns: { success, data: { url, publicId } }
          url = res.data?.data?.url ?? res.data?.url
        } catch {
          // Fallback: create local object URL for preview
          url = URL.createObjectURL(file)
          toast(lang === 'hi' ? 'छवि लोकल प्रिव्यू में लोड हुई।' : 'Image loaded as local preview.', { icon: 'ℹ️' })
        }

        const editor = quillRef.current?.getEditor()
        if (editor && url) {
          const range = editor.getSelection(true)
          editor.insertEmbed(range.index, 'image', url)
          editor.setSelection(range.index + 1)
          toast.success(lang === 'hi' ? 'छवि अपलोड हुई!' : 'Image uploaded!')
        }
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  return (
    <div className="relative">
      {uploading && (
        <div className="absolute inset-0 bg-cream-50/80 dark:bg-ink-700/80 flex items-center justify-center z-20 rounded-xl">
          <div className="flex items-center gap-3 text-sm text-ink-500 dark:text-ink-300 hindi-text">
            <span className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            {lang === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...'}
          </div>
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          ...modules,
          toolbar: {
            container: modules.toolbar,
            handlers: { image: handleImageUpload },
          },
        }}
        formats={formats}
        placeholder={placeholder || t('content')}
        className="hindi-text"
      />
    </div>
  )
}

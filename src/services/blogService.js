import api from './api'

/* ── response unwrapper ────────────────────────────── */
const unwrap = (res) => res.data?.data ?? res.data

/* ── group → label maps ─────────────────────────────── */
const CAT_HI = {
  sahitya:      'साहित्य',
  history:      'इतिहास',
  writing:      'लेखन',
  travel:       'यात्रा',
  historical:   'ऐतिहासिक',
  romance:      'रोमांस',
  supernatural: 'अलौकिक',
  fantasy:      'काल्पनिक',
  drama:        'नाटक',
  spiritual:    'आध्यात्मिक',
}
const CAT_EN = {
  sahitya:      'Literature',
  history:      'History',
  writing:      'Writing',
  travel:       'Travel',
  historical:   'Historical',
  romance:      'Romance',
  supernatural: 'Supernatural',
  fantasy:      'Fantasy',
  drama:        'Drama',
  spiritual:    'Spiritual',
}

/* ── helpers ─────────────────────────────────────────── */
function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}
function makeExcerpt(html, n = 200) {
  const text = stripHtml(html)
  return text.length > n ? text.slice(0, n) + '…' : text
}

/* ── normalise a blog from the backend ──────────────── */
// Backend: { _id, title, content, coverImage, group, status, likeCount, commentCount, createdAt }
function normaliseBlog(b) {
  if (!b) return null
  const group   = b.group ?? b.category ?? ''
  const excerpt = makeExcerpt(b.content ?? b.contentHi ?? '', 200)
  return {
    id:             b._id ?? b.id,
    _id:            b._id ?? b.id,
    slug:           b.slug ?? b._id ?? b.id,
    title:          b.title,                        // raw (Hindi)
    titleHi:        b.titleHi ?? b.title ?? '',
    titleEn:        b.titleEn ?? b.title ?? '',
    content:        b.content ?? b.contentHi ?? '',
    contentHi:      b.contentHi ?? b.content ?? '',
    contentEn:      b.contentEn ?? '',
    // Derive excerpt from content if not provided by backend
    excerptHi:      b.excerptHi ?? b.excerpt ?? excerpt,
    excerptEn:      b.excerptEn ?? b.excerpt ?? excerpt,
    coverImage:     b.coverImage ?? '',
    author:         b.author.name ?? 'Pratigya Singh',
    group,
    category:       b.category ?? group,
    categoryHi:     b.categoryHi ?? CAT_HI[group] ?? group,
    categoryEn:     b.categoryEn ?? CAT_EN[group] ?? group,
    status:         b.status ?? 'published',
    likeCount:      b.likeCount ?? 0,
    commentCount:   b.commentCount ?? 0,
    readingTimeMin: b.readingTimeMin ?? Math.max(1, Math.ceil((stripHtml(b.content ?? '').split(/\s+/).length || 0) / 200)),
    tags:           b.tags ?? [],
    featured:       b.featured ?? false,
    publishedAt:    b.publishedAt ?? b.createdAt,
    updatedAt:      b.updatedAt,
  }
}

/* ═══════════════════════════════════════════════════════ */
export const blogService = {

  /* ── GET /blogs ─────────────────────────────────────── */
  async getBlogs({ page = 1, limit = 10, search = '' } = {}) {
    try {
      const res  = await api.get('/blogs', { params: { page, limit, search } })
      const data = unwrap(res)
      const list = data.blogs ?? data
      return { data: Array.isArray(list) ? list.map(normaliseBlog) : [], total: data.total ?? 0 }
    } catch {
      return { data: [], total: 0 }
    }
  },

  /* ── Admin: GET /blogs/admin/all ────────────────────── */
  async getAdminBlogs({ page = 1, limit = 50, search = '' } = {}) {
    try {
      const res  = await api.get('/blogs/admin/all', { params: { page, limit, search } })
      const data = unwrap(res)
      const list = data.blogs ?? data
      return { data: Array.isArray(list) ? list.map(normaliseBlog) : [], total: data.total ?? 0 }
    } catch {
      return { data: [], total: 0 }
    }
  },

  /* ── Admin: GET /blogs/admin/:id ───────────────────── */
  async getAdminBlog(id) {
    try {
      const res  = await api.get(`/blogs/admin/${id}`)
      const data = unwrap(res)
      return normaliseBlog(data.blog ?? data)
    } catch {
      return null
    }
  },

  /* ── GET /blogs/:id ─────────────────────────────────── */
  async getBlog(id) {
    try {
      const res  = await api.get(`/blogs/${id}`)
      const data = unwrap(res)
      return normaliseBlog(data.blog ?? data)
    } catch {
      return null
    }
  },

  /* ── POST /blogs/:id/like ───────────────────────────── */
  async likeBlog(id) {
    const res = await api.post(`/blogs/${id}/like`)
    return unwrap(res)
  },

  /* ── DELETE /blogs/:id/like ─────────────────────────── */
  async unlikeBlog(id) {
    const res = await api.delete(`/blogs/${id}/like`)
    return unwrap(res)
  },

  /* ── GET /blogs/:id/comments ────────────────────────── */
  async getComments(id, { page = 1, limit = 20 } = {}) {
    try {
      const res  = await api.get(`/blogs/${id}/comments`, { params: { page, limit } })
      const data = unwrap(res)
      return data.comments ?? data
    } catch {
      return []
    }
  },

  /* ── POST /blogs/:id/comments ───────────────────────── */
  // Backend body: { text }
  async addComment(id, { text }) {
    try {
      const res  = await api.post(`/blogs/${id}/comments`, { text })
      const data = unwrap(res)
      return data.comment ?? data
    } catch {
      return { id: Date.now(), text, authorName: 'You', createdAt: new Date().toISOString() }
    }
  },

  /* ── DELETE /blogs/comments/:commentId ──────────────── */
  async deleteComment(commentId) {
    const res = await api.delete(`/blogs/comments/${commentId}`)
    return unwrap(res)
  },

  /* ── Admin: POST /blogs ─────────────────────────────── */
  // Backend body: { title, content, coverImage, status }
  async createBlog(payload) {
    const res  = await api.post('/blogs', payload)
    const data = unwrap(res)
    return normaliseBlog(data.blog ?? data)
  },

  /* ── Admin: PUT /blogs/:id ──────────────────────────── */
  async updateBlog(id, payload) {
    const res  = await api.put(`/blogs/${id}`, payload)
    const data = unwrap(res)
    return normaliseBlog(data.blog ?? data)
  },

  /* ── Admin: PATCH /blogs/:id/publish ───────────────── */
  async publishBlog(id) {
    const res = await api.patch(`/blogs/${id}/publish`)
    return unwrap(res)
  },

  /* ── Admin: PATCH /blogs/:id/unpublish ─────────────── */
  async unpublishBlog(id) {
    const res = await api.patch(`/blogs/${id}/unpublish`)
    return unwrap(res)
  },

  /* ── Admin: DELETE /blogs/:id ───────────────────────── */
  async deleteBlog(id) {
    const res = await api.delete(`/blogs/${id}`)
    return unwrap(res)
  },
}

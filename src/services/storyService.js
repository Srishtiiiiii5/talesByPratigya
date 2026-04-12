import api from './api'

/* ── response unwrapper ────────────────────────────── */
// Backend shape: { success, data: { story|stories|part|parts, ... } }
const unwrap = (res) => res.data?.data ?? res.data

/* ── category → readable label map ─────────────────────── */
const CAT_HI = {
  supernatural: 'अलौकिक',
  historical:   'ऐतिहासिक',
  romance:      'रोमांस',
  fantasy:      'काल्पनिक',
  drama:        'नाटक',
  spiritual:    'आध्यात्मिक',
  sahitya:      'साहित्य',
  history:      'इतिहास',
}
const CAT_EN = {
  supernatural: 'Supernatural',
  historical:   'Historical',
  romance:      'Romance',
  fantasy:      'Fantasy',
  drama:        'Drama',
  spiritual:    'Spiritual',
  sahitya:      'Literature',
  history:      'History',
}

/* ── normalise a story from the backend ─────────────── */
// Backend: { _id, title, description, coverImage, category, status, likeCount, followCount, createdAt, totalParts, readCount }
function normaliseStory(s) {
  if (!s) return null
  const category = s.category ?? s.group ?? ''
  return {
    id:              s._id  ?? s.id,
    _id:             s._id  ?? s.id,
    titleHi:         s.title ?? s.titleHi ?? '',
    titleEn:         s.titleEn ?? s.title ?? '',
    subtitleHi:      s.subtitleHi ?? '',
    subtitleEn:      s.subtitleEn ?? '',
    descriptionHi:   s.description ?? s.descriptionHi ?? '',
    descriptionEn:   s.descriptionEn ?? s.description ?? '',
    coverImage:      s.coverImage ?? s.bannerImage ?? '',
    author:          s.author?.name ?? 'Pratigya Singh',
    genreHi:         s.genreHi ?? CAT_HI[category] ?? category,
    genreEn:         s.genreEn ?? CAT_EN[category] ?? category,
    totalParts:      s.totalParts ?? s.partsCount ?? 0,
    status:          s.status ?? 'published',
    featured:        s.featured ?? false,
    publishedAt:     s.publishedAt ?? s.createdAt,
    updatedAt:       s.updatedAt,
    readCount:       s.readCount ?? s.viewCount ?? 0,
    likeCount:       s.likeCount ?? 0,
    followCount:     s.followCount ?? 0,
    tags:            s.tags ?? [],
    category,
  }
}

/* ── normalise a part ────────────────────────────────── */
// Backend: { _id, partNumber, title, content, bannerImage, createdAt }
function normalisePart(p) {
  if (!p) return null
  return {
    id:              p._id  ?? p.id,
    _id:             p._id  ?? p.id,
    storyId:         p.storyId,
    partNumber:      p.partNumber,
    titleHi:         p.title ?? p.titleHi ?? '',
    titleEn:         p.titleEn ?? p.title ?? '',
    summary:         p.summary ?? '',
    content:         p.content ?? '',
    bannerImage:     p.bannerImage ?? '',
    readingTimeMin:  p.readingTimeMin ?? Math.max(1, Math.ceil((p.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0) / 200)),
    publishedAt:     p.publishedAt ?? p.createdAt,
  }
}

/* ═══════════════════════════════════════════════════════ */
export const storyService = {

  /* ── GET /stories ──────────────────────────────────── */
  async getStories({ page = 1, limit = 10, search = '', category = '' } = {}) {
    try {
      const res  = await api.get('/stories', { params: { page, limit, search, category } })
      const data = unwrap(res)
      const list = data.stories ?? data
      return { data: Array.isArray(list) ? list.map(normaliseStory) : [], total: data.total ?? 0 }
    } catch {
      return { data: [], total: 0 }
    }
  },

  /* ── Admin: GET /stories/admin/all ─────────────────── */
  async getAdminStories({ page = 1, limit = 50, search = '' } = {}) {
    try {
      const res  = await api.get('/stories/admin/all', { params: { page, limit, search } })
      const data = unwrap(res)
      const list = data.stories ?? data
      return { data: Array.isArray(list) ? list.map(normaliseStory) : [], total: data.total ?? 0 }
    } catch {
      return { data: [], total: 0 }
    }
  },

  /* ── Admin: GET /stories/admin/:id ────────────────── */
  async getAdminStory(id) {
    try {
      const res  = await api.get(`/stories/admin/${id}`)
      const data = unwrap(res)
      return normaliseStory(data.story ?? data)
    } catch {
      return null
    }
  },

  /* ── GET /stories/:id ──────────────────────────────── */
  async getStory(id) {
    try {
      const res  = await api.get(`/stories/${id}`)
      const data = unwrap(res)
      return normaliseStory(data.story ?? data)
    } catch {
      return null
    }
  },

  /* ── GET /stories/:storyId/parts ───────────────────── */
  async getParts(storyId) {
    try {
      const res  = await api.get(`/stories/${storyId}/parts`)
      const data = unwrap(res)
      const list = data.parts ?? data
      return Array.isArray(list) ? list.map(normalisePart) : []
    } catch {
      return []
    }
  },

  /* ── GET /stories/:storyId/parts/:partId ───────────── */
  async getPart(storyId, partId) {
    try {
      const res  = await api.get(`/stories/${storyId}/parts/${partId}`)
      const data = unwrap(res)
      return normalisePart(data.part ?? data)
    } catch {
      return null
    }
  },

  /* ── POST /stories/:id/like ────────────────────────── */
  async likeStory(storyId) {
    const res = await api.post(`/stories/${storyId}/like`)
    return unwrap(res)
  },

  /* ── DELETE /stories/:id/like ──────────────────────── */
  async unlikeStory(storyId) {
    const res = await api.delete(`/stories/${storyId}/like`)
    return unwrap(res)
  },

  /* ── POST /stories/:id/follow ──────────────────────── */
  async followStory(storyId) {
    const res = await api.post(`/stories/${storyId}/follow`)
    return unwrap(res)
  },

  /* ── DELETE /stories/:id/follow ────────────────────── */
  async unfollowStory(storyId) {
    const res = await api.delete(`/stories/${storyId}/follow`)
    return unwrap(res)
  },

  /* ── GET /stories/:id/comments ─────────────────────── */
  async getComments(storyId, { page = 1, limit = 20 } = {}) {
    try {
      const res  = await api.get(`/stories/${storyId}/comments`, { params: { page, limit } })
      const data = unwrap(res)
      return data.comments ?? data
    } catch {
      return []
    }
  },

  /* ── POST /stories/:id/comments ────────────────────── */
  async addComment(storyId, text) {
    try {
      const res  = await api.post(`/stories/${storyId}/comments`, { text })
      const data = unwrap(res)
      return data.comment ?? data
    } catch {
      const c = { id: Date.now(), text, authorName: 'You', createdAt: new Date().toISOString() }
      return c
    }
  },

  /* ── DELETE /stories/comments/:commentId ───────────── */
  async deleteComment(commentId) {
    const res = await api.delete(`/stories/comments/${commentId}`)
    return unwrap(res)
  },

  /* ── Admin: POST /stories ───────────────────────────── */
  async createStory(payload) {
    const res  = await api.post('/stories', payload)
    const data = unwrap(res)
    return data.story ?? data
  },

  /* ── Admin: PUT /stories/:id ────────────────────────── */
  async updateStory(id, payload) {
    const res  = await api.put(`/stories/${id}`, payload)
    const data = unwrap(res)
    return data.story ?? data
  },

  /* ── Admin: PATCH /stories/:id/publish ─────────────── */
  async publishStory(id) {
    const res  = await api.patch(`/stories/${id}/publish`)
    return unwrap(res)
  },

  /* ── Admin: PATCH /stories/:id/unpublish ───────────── */
  async unpublishStory(id) {
    const res  = await api.patch(`/stories/${id}/unpublish`)
    return unwrap(res)
  },

  /* ── Admin: DELETE /stories/:id ────────────────────── */
  async deleteStory(id) {
    const res  = await api.delete(`/stories/${id}`)
    return unwrap(res)
  },

  /* ── Admin: POST /stories/:storyId/parts ───────────── */
  async createPart(storyId, payload) {
    const res  = await api.post(`/stories/${storyId}/parts`, payload)
    const data = unwrap(res)
    return normalisePart(data.part ?? data)
  },

  /* ── Admin: PUT /stories/parts/:partId ─────────────── */
  async updatePart(partId, payload) {
    const res  = await api.put(`/stories/parts/${partId}`, payload)
    const data = unwrap(res)
    return normalisePart(data.part ?? data)
  },

  /* ── Admin: DELETE /stories/parts/:partId ──────────── */
  async deletePart(partId) {
    const res = await api.delete(`/stories/parts/${partId}`)
    return unwrap(res)
  },
}

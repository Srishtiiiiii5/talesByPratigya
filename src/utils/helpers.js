/** Format a date string to a localized readable format */
export function formatDate(dateStr, lang = 'hi') {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Calculate estimated reading time in minutes */
export function calcReadingTime(content = '') {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Truncate text to N characters */
export function truncate(text, n = 150) {
  if (!text) return ''
  const clean = text.replace(/<[^>]*>/g, '')
  return clean.length > n ? clean.slice(0, n) + '…' : clean
}

/** Get stored likes from localStorage */
export function isLiked(type, id) {
  return localStorage.getItem(`tbp-liked-${type}-${id}`) === 'true'
}

/** Toggle like in localStorage */
export function toggleLike(type, id) {
  const key   = `tbp-liked-${type}-${id}`
  const liked = localStorage.getItem(key) === 'true'
  localStorage.setItem(key, (!liked).toString())
  return !liked
}

/** Check if a story is followed */
export function isFollowing(storyId) {
  const followed = JSON.parse(localStorage.getItem('tbp-followed-stories') || '[]')
  return followed.includes(storyId)
}

/** Toggle follow status */
export function toggleFollow(storyId) {
  const followed = JSON.parse(localStorage.getItem('tbp-followed-stories') || '[]')
  let updated
  if (followed.includes(storyId)) {
    updated = followed.filter(id => id !== storyId)
  } else {
    updated = [...followed, storyId]
  }
  localStorage.setItem('tbp-followed-stories', JSON.stringify(updated))
  return updated.includes(storyId)
}

/** Get subscription state */
export function isSubscribed() {
  return localStorage.getItem('tbp-subscribed') === 'true'
}

/** Toggle subscription */
export function toggleSubscription() {
  const current = isSubscribed()
  localStorage.setItem('tbp-subscribed', (!current).toString())
  return !current
}

/** Get last read part for a story */
export function getLastReadPart(storyId) {
  return localStorage.getItem(`tbp-progress-${storyId}`) ?? null
}

/** Save last read part */
export function saveReadProgress(storyId, partId) {
  localStorage.setItem(`tbp-progress-${storyId}`, partId)
}

/** Generate a cover image placeholder gradient */
export function coverGradient(index = 0) {
  const gradients = [
    'from-ink-700 via-gold-700 to-ink-900',
    'from-purple-900 via-ink-800 to-gold-700',
    'from-amber-900 via-red-900 to-ink-900',
    'from-teal-900 via-ink-800 to-gold-800',
  ]
  return gradients[index % gradients.length]
}

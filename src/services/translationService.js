/**
 * translationService.js
 * ─────────────────────
 * Free, key-less Hindi ↔ English translation powered by the MyMemory public API.
 * https://mymemory.translated.net/doc/spec.php
 *
 * • Splits long text into sentence-safe chunks (≤ 400 chars each)
 * • Caches every result in sessionStorage — no repeated API calls per session
 * • Works on both plain text and HTML content (walks DOM text-nodes)
 * • Falls back silently to the original text on any network error
 */

const CACHE_PREFIX = 'tbp_tr_'
const CHUNK_LIMIT  = 400          // MyMemory free-tier safe limit
const DEVANAGARI   = /[\u0900-\u097F]/

// ─── helpers ────────────────────────────────────────────────────────────────

function cacheKey(text, from, to) {
  // Short fingerprint: lang-pair + first 50 chars + length
  return `${CACHE_PREFIX}${from}_${to}_${text.slice(0, 50).replace(/\s+/g, '_')}_${text.length}`
}

/** Split `text` into chunks of at most `max` chars at sentence / clause boundaries */
function splitChunks(text, max = CHUNK_LIMIT) {
  // Try to split on sentence-ending punctuation first
  const parts = text.split(/(?<=[।\.\!\?])\s+/)
  const chunks = []
  let current = ''

  for (const part of parts) {
    if ((current + ' ' + part).trim().length <= max) {
      current = current ? `${current} ${part}` : part
    } else {
      if (current) chunks.push(current.trim())
      // Part itself is too long → hard-cut
      if (part.length > max) {
        for (let i = 0; i < part.length; i += max) chunks.push(part.slice(i, i + max))
        current = ''
      } else {
        current = part
      }
    }
  }
  if (current) chunks.push(current.trim())
  return chunks.filter(Boolean)
}

/** Translate a single short piece of plain text */
async function translateChunk(text, from, to) {
  if (!text?.trim()) return text

  const key = cacheKey(text, from, to)
  try {
    const hit = sessionStorage.getItem(key)
    if (hit) return hit
  } catch { /* storage full — just skip cache read */ }

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      { signal: AbortSignal.timeout ? AbortSignal.timeout(10_000) : undefined }
    )
    if (!res.ok) return text

    const json = await res.json()
    if (json.responseStatus === 200 && json.responseData?.translatedText) {
      const result = json.responseData.translatedText
      try { sessionStorage.setItem(key, result) } catch { /* ignore full storage */ }
      return result
    }
    return text
  } catch {
    return text   // network error → return original
  }
}

// ─── public API ─────────────────────────────────────────────────────────────

/**
 * Translate a plain-text string that may be longer than the API limit.
 */
export async function translateText(text, from, to) {
  if (!text || from === to) return text
  const chunks  = splitChunks(text)
  const results = await Promise.all(chunks.map(c => translateChunk(c, from, to)))
  return results.join(' ')
}

/**
 * Translate HTML content by walking its text-nodes individually.
 * HTML structure (tags, attributes) is preserved.
 */
export async function translateHtml(html, from, to) {
  if (!html || from === to) return html

  // Build a detached DOM tree from the HTML string
  const div = document.createElement('div')
  div.innerHTML = html

  // Walk every text node that has visible content
  const textNodes = []
  const walker    = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  })
  let n
  while ((n = walker.nextNode())) textNodes.push(n)

  // Translate each text node (sequential to respect rate limits)
  for (const node of textNodes) {
    const original = node.textContent
    if (!original.trim()) continue
    node.textContent = await translateText(original, from, to)
  }

  return div.innerHTML
}

/**
 * Quick helper: does this string contain Devanagari (Hindi) characters?
 */
export function isHindi(text) {
  return DEVANAGARI.test(text ?? '')
}

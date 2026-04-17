/**
 * useAutoTranslate
 * ────────────────
 * Translates HTML content whenever `htmlContent` is non-null.
 * Pass null to skip translation (e.g. when native-language content already exists).
 *
 * Usage:
 *   const { translated, isTranslating } = useAutoTranslate(needsTranslation ? html : null, 'hi', 'en')
 *   const display = translated ?? html  // show translated if ready, else original
 */
import { useState, useEffect, useRef } from 'react'
import { translateHtml } from '../services/translationService'

export function useAutoTranslate(htmlContent, from, to) {
  const [translated,    setTranslated]    = useState(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const cancelledRef = useRef(false)

  useEffect(() => {
    // Nothing to translate
    if (!htmlContent || from === to) {
      setTranslated(null)
      setIsTranslating(false)
      return
    }

    cancelledRef.current = false
    setIsTranslating(true)
    setTranslated(null)

    translateHtml(htmlContent, from, to)
      .then((result) => {
        if (!cancelledRef.current) setTranslated(result)
      })
      .catch(() => {
        if (!cancelledRef.current) setTranslated(null)  // fall back to original
      })
      .finally(() => {
        if (!cancelledRef.current) setIsTranslating(false)
      })

    // Cancel stale async work on unmount or dependency change
    return () => { cancelledRef.current = true }
  }, [htmlContent, from, to])

  return { translated, isTranslating }
}

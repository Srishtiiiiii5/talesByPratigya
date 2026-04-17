import { createContext, useContext, useState, useCallback } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('tbp-lang') || 'hi'
  )

  const switchLang = useCallback((l) => {
    setLang(l)
    localStorage.setItem('tbp-lang', l)
    i18n.changeLanguage(l)
  }, [])

  const toggle = useCallback(
    () => switchLang(lang === 'hi' ? 'en' : 'hi'),
    [lang, switchLang]
  )

  // t() delegates to i18next — all existing components work unchanged
  const t = useCallback((key) => i18n.t(key), [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LanguageContext.Provider value={{ lang, switchLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

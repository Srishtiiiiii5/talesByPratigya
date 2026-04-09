import { createContext, useContext, useState } from 'react'
import translations from '../utils/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('tbp-lang') || 'hi'
  )

  const switchLang = (l) => {
    setLang(l)
    localStorage.setItem('tbp-lang', l)
  }

  const toggle = () => switchLang(lang === 'hi' ? 'en' : 'hi')

  // translate helper
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key

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

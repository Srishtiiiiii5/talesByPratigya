import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.error('useLocalStorage error:', err)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      localStorage.removeItem(key)
    } catch { /* ignore */ }
  }

  return [storedValue, setValue, removeValue]
}

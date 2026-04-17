/**
 * WatermarkOverlay
 * ─────────────────
 * • Covers the FULL viewport (position: fixed) — every screenshot is tagged
 * • Shows "Tales by Pratigya · {username} · {date} · Private Access" for
 *   logged-in users; site URL + date for guests
 * • SVG repeating background → zero DOM overhead
 * • Two separate SVG fills: darker amber for light mode, bright gold for dark mode
 *   so the mark is always clearly visible in screenshots regardless of theme
 * • Subtle vertical drift deters screen-recording crops
 */
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function WatermarkOverlay() {
  const { user }   = useAuth()
  const { isDark } = useTheme()

  const bgUrl = useMemo(() => {
    const date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })

    const label = user
      ? `Tales by Pratigya  ·  ${user.name || user.email}  ·  ${date}  ·  Private Access`
      : `Tales by Pratigya  ·  talesbypratigya.com  ·  ${date}`

    // Escape XML special chars
    const safe = label
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    /*
     * Light mode → dark amber (shows on cream / white backgrounds)
     * Dark  mode → warm bright gold (shows on dark ink backgrounds)
     */
    const fill = isDark
      ? 'rgba(220,170,70,0.28)'    // bright gold — clearly visible on dark bg
      : 'rgba(110,65,8,0.22)'      // dark amber  — clearly visible on light bg

    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="180">',
      `<text x="240" y="90"`,
      `  font-family="'Playfair Display', Georgia, serif"`,
      `  font-size="11.5"`,
      `  fill="${fill}"`,
      `  font-weight="600"`,
      `  letter-spacing="1.4"`,
      `  text-anchor="middle"`,
      `  transform="rotate(-25 240 90)"`,
      `>${safe}</text>`,
      '</svg>',
    ].join('')

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }, [user, isDark])   // regenerate whenever user info OR theme changes

  return (
    <motion.div
      aria-hidden="true"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      style={{
        position:         'fixed',
        inset:            0,
        zIndex:           10,
        pointerEvents:    'none',
        userSelect:       'none',
        WebkitUserSelect: 'none',
        backgroundImage:  bgUrl,
        backgroundRepeat: 'repeat',
        backgroundSize:   '480px 180px',
      }}
    />
  )
}

import { WATERMARK_TEXT } from '../../utils/contentProtection'

export default function WatermarkOverlay() {
  // Tile the watermark across the content area
  const tiles = Array.from({ length: 12 })

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none"
      style={{ userSelect: 'none' }}
    >
      {tiles.map((_, i) => (
        <span
          key={i}
          style={{
            position:   'absolute',
            top:        `${(i % 4) * 25}%`,
            left:       `${Math.floor(i / 4) * 33}%`,
            transform:  'rotate(-30deg)',
            fontSize:   '0.75rem',
            fontWeight: 500,
            color:      'rgba(201,147,58,0.06)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.1em',
            fontFamily: '"Playfair Display", serif',
            userSelect: 'none',
          }}
        >
          {WATERMARK_TEXT}
        </span>
      ))}
    </div>
  )
}

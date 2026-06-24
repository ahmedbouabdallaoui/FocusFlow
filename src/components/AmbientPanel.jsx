import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'

const MODES = [
  { id: 'rain', label: 'Rain', icon: '🌧' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'lofi', label: 'Lofi', icon: '🎵' },
]

export default function AmbientPanel() {
  const [active, setActive] = useState(null)
  const soundRef = useRef(null)

  useEffect(() => {
    const layer = document.querySelector('.ambient-layer')
    if (!layer) return
    layer.className = 'ambient-layer'
    if (active) {
      layer.classList.add('active', active)
    }
  }, [active])

  function toggleMode(modeId) {
    if (active === modeId) {
      soundRef.current?.stop()
      soundRef.current = null
      setActive(null)
      return
    }

    soundRef.current?.stop()
    setActive(modeId)

    try {
      const sound = new Howl({
        src: [`/ambient-${modeId}.mp3`],
        loop: true,
        volume: 0.3,
      })
      sound.play()
      soundRef.current = sound
    } catch {
      // audio file missing but bg works
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-2">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => toggleMode(m.id)}
          className={`flex items-center justify-center rounded-xl w-11 h-11 text-lg transition-all ${
            active === m.id
              ? 'bg-[var(--active-bg)] text-[var(--accent)] ring-1 ring-[var(--accent)]/30'
              : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-secondary)]'
          }`}
          title={m.label}
        >
          {m.icon}
        </button>
      ))}
    </div>
  )
}

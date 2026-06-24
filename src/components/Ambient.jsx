import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'

const modes = [
  {
    id: 'rain',
    label: 'Rain',
    icon: '🌧',
    src: 'https://assets.codepen.io/2002873/rain.mp3',
  },
  {
    id: 'coffee',
    label: 'Coffee Shop',
    icon: '☕',
    src: 'https://assets.codepen.io/2002873/coffee-shop.mp3',
  },
  {
    id: 'lofi',
    label: 'Lofi',
    icon: '🎵',
    src: 'https://assets.codepen.io/2002873/lofi.mp3',
  },
]

export default function Ambient() {
  const [activeMode, setActiveMode] = useState(null)
  const [muted, setMuted] = useState(false)
  const howlRef = useRef(null)

  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.stop()
        howlRef.current = null
      }
    }
  }, [])

  function toggleMode(id) {
    if (howlRef.current) {
      howlRef.current.stop()
      howlRef.current = null
    }

    if (activeMode === id) {
      setActiveMode(null)
      return
    }

    const mode = modes.find((m) => m.id === id)
    const howl = new Howl({
      src: [mode.src],
      loop: true,
      volume: muted ? 0 : 0.3,
    })
    howl.play()
    howlRef.current = howl
    setActiveMode(id)
  }

  function toggleMute() {
    setMuted((prev) => {
      if (howlRef.current) {
        howlRef.current.volume(prev ? 0.3 : 0)
      }
      return !prev
    })
  }

  return (
    <div className={`ambient-bar fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border)] px-4 py-3 transition-colors ${activeMode ? `mode-${activeMode}` : ''}`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex gap-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => toggleMode(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeMode === mode.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={toggleMute}
          disabled={!activeMode}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            !activeMode
              ? 'bg-[var(--bg-elevated)] text-[var(--text-dim)] cursor-not-allowed'
              : muted
                ? 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                : 'bg-[var(--accent)] text-white'
          }`}
        >
          {muted ? '🔇 Muted' : '🔊 Sound'}
        </button>
      </div>

      {activeMode && (
        <div className={`ambient-bg ${activeMode}`} />
      )}
    </div>
  )
}

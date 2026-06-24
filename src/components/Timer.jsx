import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTimerStore, DURATIONS } from '../stores/timerStore'

const MODES = [
  { key: 'focus', label: 'Focus' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' },
]

const RADIUS = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer() {
  const { mode, secondsLeft, isRunning, start, pause, reset, setMode, tick } =
    useTimerStore()
  const intervalRef = useRef(null)

  const chimeRef = useRef(null)
  if (!chimeRef.current) {
    try {
      chimeRef.current = new Audio('/chime.mp3')
    } catch {
      chimeRef.current = null
    }
  }

  const prevModeRef = useRef(mode)

  useEffect(() => {
    if (prevModeRef.current !== mode && prevModeRef.current === 'focus' && mode !== 'focus') {
      chimeRef.current?.play().catch(() => {})
    }
    prevModeRef.current = mode
  }, [mode])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, tick])

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const total = DURATIONS[mode]
  const progress = secondsLeft / total
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m.key
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center">
        <svg width="280" height="280" className="-rotate-90">
          <circle
            cx="140"
            cy="140"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <motion.circle
            cx="140"
            cy="140"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="text-white"
          />
        </svg>
        <span className="absolute text-5xl font-light tracking-tight text-white">
          {formatTime(secondsLeft)}
        </span>
      </div>

      <div className="flex gap-4">
        <motion.button
          type="button"
          onClick={isRunning ? pause : start}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90"
        >
          {isRunning ? 'Pause' : 'Start'}
        </motion.button>
        <motion.button
          type="button"
          onClick={reset}
          whileTap={{ scale: 0.95 }}
          className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          Reset
        </motion.button>
      </div>
    </div>
  )
}

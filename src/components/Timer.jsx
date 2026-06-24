import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTimerStore } from '../stores/timerStore'

const RADIUS = 170
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer() {
  const {
    secondsLeft, isRunning, customDuration,
    start, pause, reset, setCustomDuration, tick,
  } = useTimerStore()
  const intervalRef = useRef(null)
  const chimeRef = useRef(null)

  if (!chimeRef.current) {
    try { chimeRef.current = new Audio('/chime.mp3') } catch { chimeRef.current = null }
  }

  const prevSecondsRef = useRef(secondsLeft)
  useEffect(() => {
    if (prevSecondsRef.current === 1 && secondsLeft > 1) {
      chimeRef.current?.play().catch(() => {})
    }
    prevSecondsRef.current = secondsLeft
  }, [secondsLeft])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, tick])

  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission()
  }, [])

  const baseDuration = customDuration || 20 * 60
  const progress = secondsLeft / baseDuration
  const offset = CIRCUMFERENCE * (1 - progress)

  function adjust(delta) {
    const current = customDuration || 20 * 60
    const next = Math.max(60, Math.min(180 * 60, current + delta * 60))
    setCustomDuration(next)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex items-center justify-center">
        <svg width="380" height="380" className="-rotate-90">
          <circle
            cx="190" cy="190" r={RADIUS}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"
          />
          <motion.circle
            cx="190" cy="190" r={RADIUS}
            fill="none" stroke="currentColor" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-amber-400"
          />
        </svg>
        <div className="absolute flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => adjust(-1)}
            className="text-2xl text-white/30 transition-colors hover:text-white/70"
          >
            −
          </button>
          <span className="min-w-[180px] text-center text-7xl font-light tracking-tight text-white">
            {formatTime(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={() => adjust(1)}
            className="text-2xl text-white/30 transition-colors hover:text-white/70"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          type="button"
          onClick={isRunning ? pause : start}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-white px-12 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-white/90"
        >
          {isRunning ? 'Pause' : 'Start'}
        </motion.button>
        <motion.button
          type="button"
          onClick={reset}
          whileTap={{ scale: 0.95 }}
          className="rounded-full border border-white/20 px-9 py-3 text-base font-medium text-white/60 transition-colors hover:border-white/40 hover:text-white/90"
        >
          Reset
        </motion.button>
      </div>
    </div>
  )
}

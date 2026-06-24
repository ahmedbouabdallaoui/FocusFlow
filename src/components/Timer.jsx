import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTimerStore } from '../stores/timerStore'

const CIRCUMFERENCE = 2 * Math.PI * 170

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer() {
  const {
    secondsLeft, isRunning, customDuration,
    phaseType, start, pause, reset, setCustomDuration, tick,
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
  const isFocus = phaseType === 'focus'

  function adjust(delta) {
    const current = customDuration || 20 * 60
    const next = Math.max(60, Math.min(180 * 60, current + delta * 60))
    setCustomDuration(next)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 380 380" className="w-[280px] sm:w-[340px] lg:w-[380px] -rotate-90">
          <circle
            cx="190" cy="190" r="170"
            fill="none" stroke="var(--border)" strokeWidth="4"
          />
          <motion.circle
            cx="190" cy="190" r="170"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            stroke="var(--accent)"
            animate={{
              strokeDashoffset: offset,
              opacity: isFocus && isRunning ? [1, 0.55, 1] : 1,
            }}
            transition={{
              strokeDashoffset: { duration: 0.4, ease: 'easeInOut' },
              opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </svg>
        <div className="absolute flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          <button
            type="button"
            onClick={() => adjust(-1)}
            className="text-xl sm:text-2xl text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)] p-2"
          >
            −
          </button>
          <span
            className="min-w-[120px] sm:min-w-[160px] lg:min-w-[180px] text-center font-light tracking-tight text-[var(--text-primary)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}
          >
            {formatTime(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={() => adjust(1)}
            className="text-xl sm:text-2xl text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)] p-2"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <motion.button
          type="button"
          onClick={isRunning ? pause : start}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-[var(--btn-bg)] px-8 sm:px-12 py-3 text-sm sm:text-base font-semibold text-[var(--btn-text)] transition-colors hover:bg-[var(--btn-hover)]"
        >
          {isRunning ? 'Pause' : 'Start'}
        </motion.button>
        <motion.button
          type="button"
          onClick={reset}
          whileTap={{ scale: 0.95 }}
          className="rounded-full border border-[var(--border-hover)] px-6 sm:px-9 py-3 text-sm sm:text-base font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
        >
          Reset
        </motion.button>
      </div>
    </div>
  )
}

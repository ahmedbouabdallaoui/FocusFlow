import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionStore } from '../stores/sessionStore'

export default function StreakBadge() {
  const getStreak = useSessionStore((s) => s.getStreak)

  const { current, best } = useMemo(() => getStreak(), [getStreak])

  return (
    <motion.div
      layout
      className="flex items-center gap-2 sm:gap-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] px-2.5 sm:px-4 py-1.5 sm:py-2.5 min-h-[44px]"
    >
      <AnimatePresence mode="wait">
        {current > 0 ? (
          <motion.div
            key="active"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 min-w-0"
          >
            <motion.span
              className="text-xl sm:text-2xl shrink-0"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              🔥
            </motion.span>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] tabular-nums">
                {current} day{current > 1 ? 's' : ''}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate">Keep it going!</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-xl sm:text-2xl shrink-0">🔥</span>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">0 days</span>
              <span className="text-[11px] text-[var(--text-muted)]">Start a new streak</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {best > 1 && (
        <div className="hidden xs:flex flex-col items-end ml-auto shrink-0 border-l border-[var(--border)] pl-3">
          <span className="text-[10px] font-medium text-[var(--text-dim)] uppercase tracking-wider">Best</span>
          <span className="text-sm font-semibold text-[var(--text-secondary)] tabular-nums">{best} days</span>
        </div>
      )}
    </motion.div>
  )
}

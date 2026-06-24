import { useMemo, useEffect, useState } from 'react'
import { format, subDays, startOfDay, parseISO } from 'date-fns'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useSessionStore } from '../stores/sessionStore'

function calcStreak(sessions) {
  const today = startOfDay(new Date())
  let current = 0
  const dateSet = new Set(sessions.map((s) => s.date))

  // check if today has activity to start streak
  const todayStr = format(today, 'yyyy-MM-dd')
  if (!dateSet.has(todayStr)) {
    // check yesterday
    const yesterday = format(subDays(today, 1), 'yyyy-MM-dd')
    if (!dateSet.has(yesterday)) {
      return { current: 0, best: calcBest(dateSet) }
    }
  }

  let d = today
  while (dateSet.has(format(d, 'yyyy-MM-dd'))) {
    current++
    d = subDays(d, 1)
  }

  return { current, best: calcBest(dateSet) }
}

function calcBest(dateSet) {
  const dates = [...dateSet].sort()
  let best = 0
  let temp = 0
  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      temp = 1
    } else {
      const prev = parseISO(dates[i - 1])
      const curr = parseISO(dates[i])
      const diff = (curr - prev) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        temp++
      } else {
        temp = 1
      }
    }
    if (temp > best) best = temp
  }
  return best
}

export default function StreakBadge() {
  const sessions = useSessionStore((s) => s.sessions)
  const [animatedCount, setAnimatedCount] = useState(0)

  const { current, best } = useMemo(() => calcStreak(sessions), [sessions])

  const spring = useSpring(0, { stiffness: 80, damping: 15 })
  const display = useTransform(spring, (v) => Math.round(v))

  useEffect(() => {
    spring.set(current)
    const unsubscribe = display.on('change', (v) => setAnimatedCount(v))
    return unsubscribe
  }, [current, spring, display])

  return (
    <div className="bg-surface-secondary rounded-lg p-4 text-center">
      <motion.div
        className="text-4xl mb-1"
        animate={{ scale: current > 0 ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.4 }}
      >
        {current > 0 ? '🔥' : '💤'}
      </motion.div>
      <div className="text-3xl font-bold">
        {animatedCount}
      </div>
      <div className="text-sm text-on-surface-secondary">
        {current > 0 ? 'day streak' : 'no active streak'}
      </div>
      <div className="text-xs text-on-surface-secondary mt-2">
        {current > 0
          ? 'Keep it going!'
          : 'Start a new streak'}
      </div>
      <div className="text-xs text-on-surface-secondary mt-1">
        Best: {best} days
      </div>
    </div>
  )
}

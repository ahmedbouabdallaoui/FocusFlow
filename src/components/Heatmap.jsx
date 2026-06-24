import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSessionStore } from '../stores/sessionStore'

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CELL = 12
const GAP = 3

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 }

function getIntensity(count) {
  if (count === 0) return ''
  if (count <= 2) return 'level-1'
  if (count <= 4) return 'level-2'
  if (count <= 7) return 'level-3'
  return 'level-4'
}

function dateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Heatmap() {
  const sessions = useSessionStore((s) => s.sessions)
  const [year, setYear] = useState(new Date().getFullYear())

  const years = useMemo(() => {
    const set = new Set([new Date().getFullYear()])
    sessions.forEach((s) => {
      const y = new Date(s.date).getFullYear()
      if (y >= 2020) set.add(y)
    })
    return [...set].sort((a, b) => b - a)
  }, [sessions])

  const sessionMap = useMemo(() => {
    const m = {}
    sessions.forEach((s) => { m[s.date] = s.count })
    return m
  }, [sessions])

  const months = useMemo(() => {
    const febDays = isLeap(year) ? 29 : 28
    const dim = [...DAYS_IN_MONTH]
    dim[1] = febDays

    const result = []
    let dayOfYear = 0
    for (let mi = 0; mi < 12; mi++) {
      const days = []
      for (let d = 1; d <= dim[mi]; d++) {
        const ds = dateStr(year, mi, d)
        days.push({ date: ds, count: sessionMap[ds] || 0 })
        dayOfYear++
      }
      result.push({ label: MONTH_LABELS[mi], days })
    }
    return result
  }, [year, sessionMap])

  const weeks = useMemo(() => {
    const firstJan = new Date(year, 0, 1)
    const all = months.flatMap((m) => m.days)
    const weeks = []
    let week = []
    for (let i = 0; i < firstJan.getDay(); i++) week.push(null)
    all.forEach((day) => {
      week.push(day)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    })
    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      weeks.push(week)
    }
    return weeks
  }, [months])

  const monthPositions = useMemo(() => {
    const firstJan = new Date(year, 0, 1)
    const positions = []
    let dayOffset = 0
    for (let mi = 0; mi < 12; mi++) {
      const startWeek = Math.floor((dayOffset + firstJan.getDay()) / 7)
      positions.push({ label: MONTH_LABELS[mi], weekIndex: startWeek })
      dayOffset += months[mi].days.length
    }
    return positions
  }, [year, months])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--text-muted)]">
          Focus Activity
        </h2>
        <div className="flex gap-1">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                y === year
                  ? 'bg-[var(--active-bg)] text-[var(--accent)]'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="inline-block min-w-0">
          <div className="flex mb-1 ml-[30px] text-[11px] font-medium text-[var(--text-dim)]">
            {monthPositions.map((m, i) => {
              const prevWeek = i === 0 ? 0 : monthPositions[i - 1].weekIndex
              const w = (m.weekIndex - prevWeek) * (CELL + GAP) + (CELL + GAP) / 2
              return (
                <div key={m.label} style={{ width: w > 0 ? w : CELL + GAP }} className="shrink-0 text-left">
                  {m.label}
                </div>
              )
            })}
          </div>

          <div className="flex gap-[3px]">
            <div className="flex flex-col gap-[3px] mr-[6px] text-[11px] font-medium text-[var(--text-dim)] pt-[2px] shrink-0 w-[24px]">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex items-end h-[12px] leading-none">{label}</div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <motion.div
                key={wi}
                className="flex flex-col gap-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: wi * 0.005, duration: 0.2 }}
              >
                {week.map((day, di) => {
                  if (!day) return <div key={di} className="h-[12px] w-[12px]" />
                  return (
                    <div
                      key={day.date}
                      className={`heatmap-cell ${getIntensity(day.count)} group relative h-[12px] w-[12px] rounded-[2px] cursor-default`}
                    >
                      <div
                        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 rounded-md border border-[var(--border)] px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 shadow-lg z-10"
                        style={{ backgroundColor: 'var(--tooltip-bg)', color: 'var(--text-primary)' }}
                      >
                        {sessions.length > 0 && day.count > 0
                          ? `${day.count} session${day.count > 1 ? 's' : ''} on ${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-3 justify-end text-[11px] text-[var(--text-dim)]">
            <span>Less</span>
            <div className="heatmap-cell h-[12px] w-[12px] rounded-[2px]" />
            <div className="heatmap-cell level-1 h-[12px] w-[12px] rounded-[2px]" />
            <div className="heatmap-cell level-2 h-[12px] w-[12px] rounded-[2px]" />
            <div className="heatmap-cell level-3 h-[12px] w-[12px] rounded-[2px]" />
            <div className="heatmap-cell level-4 h-[12px] w-[12px] rounded-[2px]" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

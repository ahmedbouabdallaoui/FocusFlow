import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSessionStore } from '../stores/sessionStore'

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getIntensity(count) {
  if (count === 0) return ''
  if (count <= 2) return 'level-1'
  if (count <= 4) return 'level-2'
  if (count <= 7) return 'level-3'
  return 'level-4'
}

export default function Heatmap() {
  const sessions = useSessionStore((s) => s.sessions)
  const hasData = sessions.length > 0

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    const end = new Date(today)
    const start = new Date(today)
    start.setDate(today.getDate() - 364)

    const days = []
    const d = new Date(start)
    while (d <= end) {
      days.push(d.toISOString().slice(0, 10))
      d.setDate(d.getDate() + 1)
    }

    const sessionMap = {}
    sessions.forEach((s) => { sessionMap[s.date] = s.count })

    const weeks = []
    let week = []
    for (let i = 0; i < start.getDay(); i++) {
      week.push(null)
    }
    days.forEach((date) => {
      week.push({ date, count: sessionMap[date] || 0 })
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    })
    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      weeks.push(week)
    }

    const months = []
    const seen = new Set()
    weeks.forEach((w) => {
      const first = w.find((d) => d)
      if (first) {
        const m = new Date(first.date).getMonth()
        if (!seen.has(m)) {
          seen.add(m)
          months.push({ month: m, weekIndex: weeks.indexOf(w) })
        }
      }
    })

    return { weeks, monthLabels: months }
  }, [sessions])

  if (!hasData) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--text-muted)] mb-4">
          Focus Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex gap-[3px] mb-4 opacity-30">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: 'var(--border)' }} />
            ))}
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Complete your first focus session to see your activity here</p>
          <p className="text-xs text-[var(--text-dim)] mt-1">Each square is one day</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--text-muted)] mb-4">
        Focus Activity
      </h2>

      <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2 scrollbar-thin">
        <div className="min-w-[640px] sm:min-w-0 px-4 sm:px-0">
          <div className="flex ml-8 sm:ml-10 mb-1 text-[11px] font-medium text-[var(--text-dim)]">
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                style={{ marginLeft: weekIndex === 0 ? 0 : `${(weekIndex - (monthLabels[0]?.weekIndex || 0)) * 14}px` }}
                className="shrink-0"
              >
                {MONTH_LABELS[month]}
              </div>
            ))}
          </div>

          <div className="flex gap-[2px] sm:gap-[3px]">
            <div className="flex flex-col gap-[2px] sm:gap-[3px] mr-1 text-[11px] font-medium text-[var(--text-dim)] pt-[2px] shrink-0">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex items-center h-[12px] sm:h-[14px]">{label}</div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <motion.div
                key={wi}
                className="flex flex-col gap-[2px] sm:gap-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: wi * 0.008, duration: 0.3 }}
              >
                {week.map((day, di) => {
                  if (!day) return <div key={di} className="h-[12px] sm:h-[14px] w-[12px] sm:w-[14px]" />
                  return (
                    <div
                      key={day.date}
                      className={`heatmap-cell ${getIntensity(day.count)} group relative h-[12px] sm:h-[14px] w-[12px] sm:w-[14px] rounded-[3px] cursor-default`}
                    >
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 rounded-md border border-[var(--border)] px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 shadow-lg z-10"
                        style={{ backgroundColor: 'var(--tooltip-bg)', color: 'var(--text-primary)' }}
                      >
                        {day.count > 0
                          ? `${day.count} session${day.count > 1 ? 's' : ''} — ${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
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
            <div className="heatmap-cell h-[12px] sm:h-[14px] w-[12px] sm:w-[14px] rounded-[3px]" />
            <div className="heatmap-cell level-1 h-[12px] sm:h-[14px] w-[12px] sm:w-[14px] rounded-[3px]" />
            <div className="heatmap-cell level-2 h-[12px] sm:h-[14px] w-[12px] sm:w-[14px] rounded-[3px]" />
            <div className="heatmap-cell level-3 h-[12px] sm:h-[14px] w-[12px] sm:w-[14px] rounded-[3px]" />
            <div className="heatmap-cell level-4 h-[12px] sm:h-[14px] w-[12px] sm:w-[14px] rounded-[3px]" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

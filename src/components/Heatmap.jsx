import { useMemo, useState } from 'react'
import {
  format,
  subWeeks,
  addDays,
  startOfWeek,
  isSameDay,
} from 'date-fns'
import { useSessionStore } from '../stores/sessionStore'

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const LEVELS = [
  'bg-[#161b22]',
  'bg-[#0e4429]',
  'bg-[#006d32]',
  'bg-[#26a641]',
  'bg-[#39d353]',
]

function generateWeeks() {
  const today = new Date()
  const end = startOfWeek(today, { weekStartsOn: 0 })
  const start = subWeeks(end, 51)
  const weeks = []
  for (let w = 0; w < 52; w++) {
    const days = []
    for (let d = 0; d < 7; d++) {
      days.push(addDays(start, w * 7 + d))
    }
    weeks.push(days)
  }
  return weeks
}

function getIntensity(count) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 4) return 2
  if (count <= 7) return 3
  return 4
}

export default function Heatmap() {
  const sessions = useSessionStore((s) => s.sessions)
  const [tooltip, setTooltip] = useState(null)

  const weeks = useMemo(generateWeeks, [])

  const sessionMap = useMemo(() => {
    const map = {}
    sessions.forEach((s) => {
      map[s.date] = s.count
    })
    return map
  }, [sessions])

  const today = new Date()

  const monthLabels = useMemo(() => {
    const labels = []
    weeks.forEach((days, wi) => {
      const mid = days[3]
      const prevMonth =
        wi > 0 ? format(weeks[wi - 1][3], 'MMM') : null
      const curMonth = format(mid, 'MMM')
      if (curMonth !== prevMonth) {
        labels.push({ wi, label: curMonth })
      }
    })
    return labels
  }, [weeks])

  return (
    <div className="heatmap">
      <div className="flex ml-[32px] mb-[2px]">
        {weeks.map((days, wi) => {
          const label = monthLabels.find((m) => m.wi === wi)
          return (
            <div
              key={wi}
              className="w-[13px] h-[10px] mr-[3px] text-[10px] leading-[10px] text-[#8b949e]"
            >
              {label ? label.label : ''}
            </div>
          )
        })}
      </div>

      <div className="flex">
        <div className="flex flex-col mr-[3px]">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="w-[28px] h-[13px] mb-[3px] text-[10px] leading-[13px] text-[#8b949e] text-right pr-1"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex">
          {weeks.map((days, wi) => (
            <div key={wi} className="flex flex-col mr-[3px]">
              {days.map((day, di) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const count = sessionMap[dateKey] || 0
                const level = getIntensity(count)
                const cellToday = isSameDay(day, today)
                const future = day > today

                return (
                  <div
                    key={di}
                    className={`w-[13px] h-[13px] mb-[3px] rounded-[2px] ${future ? 'bg-transparent' : LEVELS[level]} ${cellToday ? 'ring-1 ring-[#39d353]' : ''} cursor-pointer`}
                    onMouseEnter={(e) => {
                      if (future) return
                      setTooltip({
                        x: e.pageX,
                        y: e.pageY,
                        text: `${count} session${count !== 1 ? 's' : ''} on ${format(day, 'MMM d, yyyy')}`,
                      })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end mt-2 gap-1 text-[10px] text-[#8b949e]">
        <span>Less</span>
        {LEVELS.map((cls, i) => (
          <div key={i} className={`w-[13px] h-[13px] rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded shadow-lg border border-[var(--border)] pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y - 28 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

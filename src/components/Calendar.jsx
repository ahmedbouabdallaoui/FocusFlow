import { useState, useMemo } from 'react'
import { useTaskStore } from '../stores/taskStore'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const { tasks } = useTaskStore()
  const today = useMemo(() => new Date(), [])
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const tasksByDate = useMemo(() => {
    const map = {}
    tasks.forEach((t) => {
      if (t.dueDate) {
        if (!map[t.dueDate]) map[t.dueDate] = []
        map[t.dueDate].push(t)
      }
    })
    return map
  }, [tasks])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function dateStr(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--text-muted)]">Calendar</h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={prevMonth} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-base">←</button>
          <span className="text-base text-[var(--text-secondary)] font-medium min-w-[140px] text-center">
            {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button type="button" onClick={nextMonth} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-base">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {DAYS.map((d) => (
          <div key={d} className="py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold tracking-wider uppercase text-[var(--text-dim)]">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />
          const ds = dateStr(d)
          const dayTasks = tasksByDate[ds]
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          return (
            <div
              key={ds}
              className={`relative flex items-center justify-center rounded-xl py-3 sm:py-4 text-sm sm:text-base transition-colors ${
                isToday ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              {d}
              {dayTasks && dayTasks.length > 0 && (
                <span className="absolute bottom-1.5 sm:bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useSessionStore } from '../stores/sessionStore'

const FOCUS_MINUTES = 25
const BREAK_MINUTES = 5

const PIE_COLORS = ['var(--accent)', 'var(--border)']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-2 text-xs shadow-xl">
      {label && <p className="font-medium text-[var(--text-secondary)] mb-0.5">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-[var(--text-primary)]" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Stats() {
  const sessions = useSessionStore((s) => s.sessions)
  const getTodayCount = useSessionStore((s) => s.getTodayCount)
  const getWeekCount = useSessionStore((s) => s.getWeekCount)
  const getTotalFocusHours = useSessionStore((s) => s.getTotalFocusHours)

  const todayCount = useMemo(() => getTodayCount(), [getTodayCount])
  const weekCount = useMemo(() => getWeekCount(), [getWeekCount])
  const totalHours = useMemo(() => getTotalFocusHours(), [getTotalFocusHours])

  const totalSessions = useMemo(() => sessions.reduce((s, x) => s + x.count, 0), [sessions])

  const pieData = useMemo(() => {
    const focusMinutes = totalSessions * FOCUS_MINUTES
    const breakMinutes = totalSessions * BREAK_MINUTES
    return [
      { name: 'Focus', value: Math.round(focusMinutes) },
      { name: 'Break', value: Math.round(breakMinutes) },
    ]
  }, [totalSessions])

  const barData = useMemo(() => {
    const last7 = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().slice(0, 10)
      const s = sessions.find((s) => s.date === ds)
      last7.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: s ? s.count : 0,
      })
    }
    return last7
  }, [sessions])

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--text-muted)]">Stats</h2>

      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4 min-h-[80px]">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">Today</span>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{todayCount}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">focus sessions</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4 min-h-[80px]">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">This Week</span>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{weekCount}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">focus sessions</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4 min-h-[80px]">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">Total Time</span>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{totalHours.toFixed(1)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">focus hours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">Focus vs Break</h3>
          {totalSessions > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[180px] text-sm text-[var(--text-muted)]">No data yet</div>
          )}
        </div>

        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">Last 7 Days</h3>
          {totalSessions > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--text-dim)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: 'var(--text-dim)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sessions" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[180px] text-sm text-[var(--text-muted)]">No data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

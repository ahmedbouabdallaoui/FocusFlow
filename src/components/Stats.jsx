import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useSessionStore } from '../stores/sessionStore'

const FOCUS_MINUTES = 25
const BREAK_MINUTES = 5
const PIE_COLORS = ['var(--accent)', 'var(--border)']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs shadow-xl"
      style={{ backgroundColor: 'var(--tooltip-bg)', color: 'var(--text-primary)' }}
    >
      {label && <p className="font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-medium" style={{ color: p.color }}>
          {`${p.name}: ${p.value} min`}
        </p>
      ))}
    </div>
  )
}

function Card({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl border border-[var(--border)] p-4"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {children}
    </motion.div>
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
      <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Stats</h2>

      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
        <Card delay={0.05}>
          <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Today</span>
          <p className="text-2xl font-bold mt-1 tabular-nums" style={{ color: 'var(--text-primary)' }}>{todayCount}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>focus sessions</p>
        </Card>
        <Card delay={0.1}>
          <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>This Week</span>
          <p className="text-2xl font-bold mt-1 tabular-nums" style={{ color: 'var(--text-primary)' }}>{weekCount}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>focus sessions</p>
        </Card>
        <Card delay={0.15}>
          <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Total Time</span>
          <p className="text-2xl font-bold mt-1 tabular-nums" style={{ color: 'var(--text-primary)' }}>{totalHours.toFixed(1)}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>focus hours</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card delay={0.2}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>Focus vs Break</h3>
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
            <div className="flex flex-col items-center justify-center h-[180px] text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No data yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Complete a focus session to see your breakdown</p>
            </div>
          )}
        </Card>

        <Card delay={0.25}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>Last 7 Days</h3>
          {totalSessions > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
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
            <div className="flex flex-col items-center justify-center h-[180px] text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No data yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Your weekly activity will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

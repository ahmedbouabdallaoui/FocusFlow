import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
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
      className="rounded-xl border border-[var(--border)] p-4 h-full"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {children}
    </motion.div>
  )
}

export default function Stats() {
  const sessions = useSessionStore((s) => s.sessions)
  const totalSessions = useMemo(() => sessions.reduce((s, x) => s + x.count, 0), [sessions])

  const focusMinutes = totalSessions * FOCUS_MINUTES
  const breakMinutes = totalSessions * BREAK_MINUTES
  const focusPct = totalSessions > 0 ? Math.round((focusMinutes / (focusMinutes + breakMinutes)) * 100) : 0

  const pieData = useMemo(() => [
    { name: 'Focus', value: focusMinutes },
    { name: 'Break', value: breakMinutes },
  ], [focusMinutes, breakMinutes])

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
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card delay={0.05}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>Work vs Rest</h3>
          {totalSessions > 0 ? (
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-full max-w-[200px] mx-auto">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={88}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={entry.name} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center pointer-events-none">
                  <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{focusPct}%</span>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>focus</span>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-6 mt-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                  <span className="text-[11px] sm:text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Focus {Math.round(focusMinutes)}min</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--border)' }} />
                  <span className="text-[11px] sm:text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Break {Math.round(breakMinutes)}min</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center h-[200px]">
                <svg width="176" height="176" viewBox="0 0 176 176" className="absolute">
                  <circle cx="88" cy="88" r="75" fill="none" stroke="var(--border)" strokeWidth="26" strokeDasharray="4 4" opacity="0.3" />
                </svg>
                <div className="flex flex-col items-center pointer-events-none">
                  <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-dim)' }}>0%</span>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-dim)' }}>focus</span>
                </div>
              </div>
              <div className="flex gap-6 mt-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--border)', opacity: 0.3 }} />
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Focus &mdash;min</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--border)', opacity: 0.3 }} />
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Break &mdash;min</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card delay={0.1}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>Last 7 Days</h3>
          {totalSessions > 0 ? (
            <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="h-[240px] min-w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 4, bottom: 5, left: -10 }}>
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
                    <Bar dataKey="sessions" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between h-[200px] pt-6 px-2 gap-2">
              {['Mon','','Wed','','Fri','',''].map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-[4px]"
                    style={{
                      height: `${[40,60,30,70,20,50,0][i]}px`,
                      backgroundColor: 'var(--border)',
                      opacity: 0.2,
                    }}
                  />
                  <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                    {d || ['M','T','W','T','F','S','S'][i]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

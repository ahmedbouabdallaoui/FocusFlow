import { useMemo } from 'react'
import {
  format,
  startOfWeek,
  subDays,
} from 'date-fns'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useSessionStore } from '../stores/sessionStore'

const PIE_COLORS = ['#22c55e', '#3b82f6']

export default function Stats() {
  const sessions = useSessionStore((s) => s.sessions)

  const { todayCount, weekCount, totalHours, last7, pieData } = useMemo(() => {
    const now = new Date()
    const todayStr = format(now, 'yyyy-MM-dd')
    const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd')

    let todayCount = 0
    let weekCount = 0
    let totalSessions = 0
    const dayMap = {}

    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(now, i), 'yyyy-MM-dd')
      dayMap[d] = 0
    }

    sessions.forEach((s) => {
      if (s.date === todayStr) todayCount += s.count
      if (s.date >= weekStart) weekCount += s.count
      totalSessions += s.count
      if (s.date in dayMap) dayMap[s.date] += s.count
    })

    const totalHours = Math.round((totalSessions * 25) / 60)
    const focusMinutes = totalSessions * 25
    const breakMinutes = totalSessions * 5

    const last7 = Object.entries(dayMap).map(([date, count]) => ({
      date: format(new Date(date), 'EEE'),
      sessions: count,
    }))

    const pieData = [
      { name: 'Focus', value: focusMinutes || 1 },
      { name: 'Break', value: breakMinutes || 1 },
    ]

    return { todayCount, weekCount, totalHours, last7, pieData }
  }, [sessions])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg p-4 text-center bg-[var(--bg-elevated)]">
          <div className="text-2xl font-bold text-[var(--accent)]">{todayCount}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">Today</div>
        </div>
        <div className="rounded-lg p-4 text-center bg-[var(--bg-elevated)]">
          <div className="text-2xl font-bold text-[var(--accent)]">{weekCount}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">This Week</div>
        </div>
        <div className="rounded-lg p-4 text-center bg-[var(--bg-elevated)]">
          <div className="text-2xl font-bold text-[var(--accent)]">{totalHours}h</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">All Time</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg p-4 bg-[var(--bg-elevated)]">
          <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Focus vs Break</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => `${Math.round(value / 25)} sessions`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs text-[var(--text-secondary)] mt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Focus
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Break
            </span>
          </div>
        </div>

        <div className="rounded-lg p-4 bg-[var(--bg-elevated)]">
          <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last7}>
              <XAxis
                dataKey="date"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                hide
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey="sessions"
                fill="#22c55e"
                radius={[3, 3, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

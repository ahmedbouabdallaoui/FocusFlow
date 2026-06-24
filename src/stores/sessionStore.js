import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function generateMockData() {
  const data = []
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - 60)
  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const ds = d.toISOString().slice(0, 10)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) {
      if (Math.random() > 0.4) data.push({ date: ds, count: Math.floor(Math.random() * 3) + 1 })
    } else {
      if (Math.random() > 0.2) data.push({ date: ds, count: Math.floor(Math.random() * 6) + 2 })
    }
  }
  return data
}

export const useSessionStore = create(
  persist(
    (set, get) => ({
      sessions: generateMockData(),

      logSession: () => {
        const date = todayStr()
        const sessions = [...get().sessions]
        const idx = sessions.findIndex((s) => s.date === date)
        if (idx >= 0) {
          sessions[idx] = { ...sessions[idx], count: sessions[idx].count + 1 }
        } else {
          sessions.push({ date, count: 1 })
        }
        set({ sessions })
      },

      getTodayCount: () => {
        const s = get().sessions.find((s) => s.date === todayStr())
        return s ? s.count : 0
      },

      getWeekCount: () => {
        const now = new Date()
        const start = new Date(now)
        start.setDate(now.getDate() - now.getDay())
        const end = new Date(start)
        end.setDate(start.getDate() + 7)
        return get().sessions
          .filter((s) => {
            const d = new Date(s.date)
            return d >= start && d < end
          })
          .reduce((sum, s) => sum + s.count, 0)
      },

      getTotalFocusHours: () => {
        return get().sessions.reduce((sum, s) => sum + s.count, 0) * (25 / 60)
      },

      getStreak: () => {
        const dates = get().sessions
          .filter((s) => s.count > 0)
          .map((s) => s.date)
          .sort()
        if (dates.length === 0) return { current: 0, best: 0 }

        let current = 0
        let best = 0
        let streak = 0
        const today = todayStr()

        for (let i = 0; i < dates.length; i++) {
          if (i === 0 || isConsecutive(dates[i - 1], dates[i])) {
            streak++
          } else {
            streak = 1
          }
          if (streak > best) best = streak
        }

        const lastDate = dates[dates.length - 1]
        if (lastDate === today || isConsecutive(lastDate, today)) {
          current = streak
        } else {
          current = 0
        }

        return { current, best }
      },

      getLast7Days: () => {
        const result = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const ds = d.toISOString().slice(0, 10)
          const s = get().sessions.find((s) => s.date === ds)
          result.push({ date: ds, count: s ? s.count : 0 })
        }
        return result
      },
    }),
    { name: 'focus-flow-sessions' },
  ),
)

function isConsecutive(a, b) {
  const da = new Date(a)
  const db = new Date(b)
  const diff = (db - da) / (1000 * 60 * 60 * 24)
  return diff === 1
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

export const useSessionStore = create(
  persist(
    (set) => ({
      sessions: [],
      addSession: () => {
        const today = format(new Date(), 'yyyy-MM-dd')
        set((state) => {
          const existing = state.sessions.find((s) => s.date === today)
          if (existing) {
            return {
              sessions: state.sessions.map((s) =>
                s.date === today ? { ...s, count: s.count + 1 } : s,
              ),
            }
          }
          return { sessions: [...state.sessions, { date: today, count: 1 }] }
        })
      },
    }),
    { name: 'focus-flow-sessions' },
  ),
)

import { create } from 'zustand'

const DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

function getNextMode(mode, sessionCount) {
  if (mode !== 'focus') return 'focus'
  return sessionCount % 4 === 0 ? 'longBreak' : 'shortBreak'
}

export const useTimerStore = create((set, get) => ({
  mode: 'focus',
  secondsLeft: DURATIONS.focus,
  isRunning: false,
  activeTaskId: null,
  completedSessions: 0,

  start: () => {
    const { isRunning } = get()
    if (isRunning) return
    set({ isRunning: true })
  },

  pause: () => set({ isRunning: false }),

  reset: () => {
    const { mode } = get()
    set({ secondsLeft: DURATIONS[mode], isRunning: false })
  },

  setMode: (mode) => {
    set({ mode, secondsLeft: DURATIONS[mode], isRunning: false })
  },

  setActiveTask: (taskId) => set({ activeTaskId: taskId }),

  tick: () => {
    const { secondsLeft, isRunning, mode, completedSessions } = get()
    if (!isRunning || secondsLeft <= 0) return

    if (secondsLeft === 1) {
      const nextMode = getNextMode(mode, completedSessions)
      if (Notification.permission === 'granted') {
        new Notification('Focus Flow', {
          body: mode === 'focus' ? 'Focus session complete! Time for a break.' : 'Break over! Time to focus.',
        })
      }
      set({
        secondsLeft: DURATIONS[nextMode],
        mode: nextMode,
        isRunning: false,
        completedSessions: mode === 'focus' ? completedSessions + 1 : completedSessions,
      })
      return
    }

    set({ secondsLeft: secondsLeft - 1 })
  },
}))

export { DURATIONS }

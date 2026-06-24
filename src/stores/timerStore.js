import { create } from 'zustand'

const AUTO_FLOW = [
  { type: 'focus', duration: 20 * 60 },
  { type: 'shortBreak', duration: 5 * 60 },
  { type: 'focus', duration: 20 * 60 },
  { type: 'shortBreak', duration: 5 * 60 },
  { type: 'focus', duration: 20 * 60 },
  { type: 'longBreak', duration: 15 * 60 },
]

const FLOW_LABELS = {
  focus: { prefix: 'Focus', total: 3 },
  shortBreak: { prefix: 'Break', total: 2 },
  longBreak: { prefix: 'Long Break', total: 1 },
}

function getPhaseLabel(phaseIndex) {
  const phase = AUTO_FLOW[phaseIndex]
  const info = FLOW_LABELS[phase.type]
  const count = Math.floor(phaseIndex / 2) + 1
  return { label: phase.type === 'longBreak' ? 'Long Break' : `${info.prefix} ${count}/${info.total}`, type: phase.type }
}

export const useTimerStore = create((set, get) => ({
  phaseIndex: 0,
  secondsLeft: AUTO_FLOW[0].duration,
  isRunning: false,
  activeTaskId: null,
  completedSessions: 0,
  customDuration: null,

  phaseLabel: getPhaseLabel(0).label,
  phaseType: getPhaseLabel(0).type,

  start: () => {
    const { isRunning } = get()
    if (isRunning) return
    set({ isRunning: true })
  },

  pause: () => set({ isRunning: false }),

  reset: () => {
    const { phaseIndex, customDuration } = get()
    set({ secondsLeft: customDuration || AUTO_FLOW[phaseIndex].duration, isRunning: false })
  },

  setCustomDuration: (duration) => {
    set({ secondsLeft: duration, customDuration: duration })
  },

  clearCustomDuration: () => {
    const { phaseIndex } = get()
    set({ customDuration: null, secondsLeft: AUTO_FLOW[phaseIndex].duration })
  },

  setActiveTask: (taskId) => set({ activeTaskId: taskId }),

  tick: () => {
    const { secondsLeft, isRunning, phaseIndex, completedSessions } = get()
    if (!isRunning || secondsLeft <= 0) return

    if (secondsLeft === 1) {
      const phase = AUTO_FLOW[phaseIndex]
      const isFocus = phase.type === 'focus'

      if (Notification.permission === 'granted') {
        new Notification('Focus Flow', {
          body: isFocus ? 'Focus session complete! Time for a break.' : 'Break over! Time to focus.',
        })
      }

      const nextIndex = (phaseIndex + 1) % AUTO_FLOW.length
      const nextPhase = AUTO_FLOW[nextIndex]
      const label = getPhaseLabel(nextIndex)

      set({
        phaseIndex: nextIndex,
        secondsLeft: nextPhase.duration,
        isRunning: false,
        customDuration: null,
        completedSessions: isFocus ? completedSessions + 1 : completedSessions,
        phaseLabel: label.label,
        phaseType: label.type,
      })
      return
    }

    set({ secondsLeft: secondsLeft - 1 })
  },
}))

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let nextId = 1

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => {
        const t = { id: nextId++, done: false, order: get().tasks.length, ...task }
        set({ tasks: [...get().tasks, t] })
      },

      editTask: (id, updates) => {
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })
      },

      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) })
      },

      toggleTask: (id) => {
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })
      },

      reorderTasks: (tasks) => set({ tasks }),
    }),
    { name: 'focus-flow-tasks' },
  ),
)

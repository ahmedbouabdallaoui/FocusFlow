import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let nextId = 1

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (title) => {
        const task = { id: nextId++, title, done: false, order: get().tasks.length }
        set({ tasks: [...get().tasks, task] })
      },

      editTask: (id, title) => {
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, title } : t)) })
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

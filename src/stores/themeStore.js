import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const accents = ['blue', 'green', 'orange', 'purple', 'pink', 'teal']

export const useThemeStore = create(
  persist(
    (set) => ({
      mode: 'dark',
      accent: 'blue',
      setMode: (mode) => set({ mode }),
      setAccent: (accent) => {
        if (accents.includes(accent)) set({ accent })
      },
      toggleMode: () =>
        set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'focus-flow-theme' },
  ),
)

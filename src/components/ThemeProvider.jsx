import { useEffect } from 'react'
import { useThemeStore } from '../stores/themeStore'

const accentMap = {
  blue:   { base: '#3b82f6', hover: '#2563eb', light: '#dbeafe' },
  green:  { base: '#22c55e', hover: '#16a34a', light: '#dcfce7' },
  orange: { base: '#f97316', hover: '#ea580c', light: '#ffedd5' },
  purple: { base: '#a855f7', hover: '#9333ea', light: '#f3e8ff' },
  pink:   { base: '#ec4899', hover: '#db2777', light: '#fce7f3' },
  teal:   { base: '#14b8a6', hover: '#0d9488', light: '#ccfbf1' },
}

export default function ThemeProvider({ children }) {
  const { mode, accent } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle('light', mode === 'light')
    root.classList.toggle('dark', mode === 'dark')

    const c = accentMap[accent]
    if (c) {
      root.style.setProperty('--accent', c.base)
      root.style.setProperty('--accent-hover', c.hover)
      root.style.setProperty('--accent-light', c.light)
    }
  }, [mode, accent])

  return <>{children}</>
}

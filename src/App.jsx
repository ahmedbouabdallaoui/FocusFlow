import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import Timer from './components/Timer'
import TaskList from './components/TaskList'
import Calendar from './components/Calendar'
import ThemePanel from './components/ThemePanel'
import AmbientPanel from './components/AmbientPanel'
import Stats from './components/Stats'
import Heatmap from './components/Heatmap'
import StreakBadge from './components/StreakBadge'
import { useTimerStore } from './stores/timerStore'
import { useSessionStore } from './stores/sessionStore'

export default function App() {
  const [view, setView] = useState('pomodoro')
  const completedSessions = useTimerStore((s) => s.completedSessions)
  const logSession = useSessionStore((s) => s.logSession)
  const prevRef = useRef(completedSessions)

  useEffect(() => {
    if (completedSessions > prevRef.current) {
      logSession()
    }
    prevRef.current = completedSessions
  }, [completedSessions, logSession])

  return (
    <div className="flex min-h-svh bg-[var(--bg-primary)]">
      <Sidebar view={view} setView={setView} />

      <main className="flex flex-1 flex-col overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 lg:pb-12">
        <div className="flex-1">
          {view === 'pomodoro' && (
            <div className="relative flex items-center justify-center h-full">
              <Timer />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:block">
                <AmbientPanel />
              </div>
            </div>
          )}

          {view === 'tasks' && (
            <div className="flex w-full max-w-2xl flex-col items-center mx-auto">
              <TaskList />
            </div>
          )}

          {view === 'stats' && (
            <div className="w-full max-w-3xl mx-auto space-y-8">
              <div className="flex items-center">
                <div className="flex-1">
                  <Heatmap />
                </div>
                <div className="hidden sm:block shrink-0 ml-6">
                  <StreakBadge />
                </div>
              </div>
              <div className="sm:hidden">
                <StreakBadge />
              </div>
              <Stats />
            </div>
          )}

          {view === 'calendar' && (
            <div className="flex w-full max-w-xl flex-col items-center mx-auto">
              <Calendar />
            </div>
          )}

          {view === 'theme' && (
            <div className="flex w-full max-w-xl flex-col items-center mx-auto">
              <ThemePanel />
            </div>
          )}
        </div>
      </main>

      <div className="ambient-layer" />
      <MobileNav view={view} setView={setView} />
    </div>
  )
}

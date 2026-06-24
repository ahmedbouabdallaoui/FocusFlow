import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import Timer from './components/Timer'
import TaskList from './components/TaskList'
import Calendar from './components/Calendar'
import ThemePanel from './components/ThemePanel'
import AmbientPanel from './components/AmbientPanel'

export default function App() {
  const [view, setView] = useState('pomodoro')

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
            <div className="w-full max-w-2xl mx-auto">
              <p className="text-center py-16 text-sm text-[var(--text-muted)]">Stats — coming from Mohammed</p>
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

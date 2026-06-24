import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Timer from './components/Timer'
import TaskList from './components/TaskList'
import Calendar from './components/Calendar'
import ThemePanel from './components/ThemePanel'

const PLACEHOLDER_STYLES = 'text-sm text-white/30 text-center py-16'

export default function App() {
  const [view, setView] = useState('pomodoro')

  return (
    <div className="flex min-h-svh bg-neutral-950">
      <Sidebar view={view} setView={setView} />

      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-12">
        {view === 'pomodoro' && (
          <div className="flex flex-col items-center">
            <Timer />
          </div>
        )}

        {view === 'tasks' && (
          <div className="flex w-full max-w-2xl flex-col items-center">
            <TaskList />
          </div>
        )}

        {view === 'stats' && (
          <p className={PLACEHOLDER_STYLES}>
            Stats dashboard — coming from Mohammed
          </p>
        )}

        {view === 'calendar' && (
          <div className="flex w-full max-w-xl flex-col items-center">
            <Calendar />
          </div>
        )}

        {view === 'heatmap' && (
          <p className={PLACEHOLDER_STYLES}>
            Heatmap — coming from Mohammed
          </p>
        )}

        {view === 'theme' && (
          <div className="flex w-full max-w-xl flex-col items-center">
            <ThemePanel />
          </div>
        )}
      </main>
    </div>
  )
}

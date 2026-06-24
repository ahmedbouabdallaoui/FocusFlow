import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Timer from './components/Timer'
import TaskList from './components/TaskList'
import Calendar from './components/Calendar'
import ThemePanel from './components/ThemePanel'
import Heatmap from './components/Heatmap'
import Stats from './components/Stats'
import Ambient from './components/Ambient'

export default function App() {
  const [view, setView] = useState('pomodoro')

  return (
    <div className="flex min-h-svh bg-[var(--bg-primary)]">
      <Sidebar view={view} setView={setView} />

      <main className="flex flex-1 flex-col overflow-y-auto px-8 py-12">
        <div className="flex-1">
          {view === 'pomodoro' && (
            <div className="flex flex-col items-center justify-center h-full">
              <Timer />
            </div>
          )}

          {view === 'tasks' && (
            <div className="flex w-full max-w-2xl flex-col items-center mx-auto">
              <TaskList />
            </div>
          )}

          {view === 'stats' && (
            <div className="w-full max-w-2xl mx-auto">
              <Stats />
            </div>
          )}

          {view === 'calendar' && (
            <div className="flex w-full max-w-xl flex-col items-center mx-auto">
              <Calendar />
            </div>
          )}

          {view === 'heatmap' && (
            <div className="w-full max-w-3xl mx-auto">
              <Heatmap />
            </div>
          )}

          {view === 'theme' && (
            <div className="flex w-full max-w-xl flex-col items-center mx-auto">
              <ThemePanel />
            </div>
          )}
        </div>
      </main>

      <Ambient />
    </div>
  )
}

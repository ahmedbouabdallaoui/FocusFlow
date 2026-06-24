import Timer from './components/Timer'
import TaskList from './components/TaskList'

export default function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-12 bg-neutral-950 px-4">
      <Timer />
      <TaskList />
    </div>
  )
}

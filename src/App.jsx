import Heatmap from './components/Heatmap.jsx'
import Stats from './components/Stats.jsx'
import StreakBadge from './components/StreakBadge.jsx'
import Ambient from './components/Ambient.jsx'

function App() {
  return (
    <div className="min-h-screen bg-surface text-on-surface pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <header className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">Focus Flow</h1>
          <StreakBadge />
        </header>

        <section>
          <h2 className="text-lg font-semibold mb-3">Activity</h2>
          <Heatmap />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Statistics</h2>
          <Stats />
        </section>
      </div>

      <Ambient />
    </div>
  )
}

export default App

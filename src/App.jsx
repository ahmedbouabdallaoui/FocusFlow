import Heatmap from './components/Heatmap.jsx'

function App() {
  return (
    <div className="min-h-screen bg-surface text-on-surface p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Focus Flow</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-3">Activity</h2>
          <Heatmap />
        </section>
      </main>
    </div>
  )
}

export default App

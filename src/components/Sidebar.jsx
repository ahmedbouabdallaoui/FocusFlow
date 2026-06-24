const NAV_ITEMS = [
  { id: 'pomodoro', label: 'Pomodoro', icon: '◉' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'stats', label: 'Stats', icon: '◈' },
  { id: 'calendar', label: 'Calendar', icon: '☐' },
  { id: 'heatmap', label: 'Heatmap', icon: '⊞' },
]

function NavButton({ item, view, setView }) {
  const active = view === item.id
  return (
    <div className="group relative flex items-center justify-center">
      <button
        type="button"
        onClick={() => setView(item.id)}
        className={`flex items-center justify-center rounded-xl w-12 h-11 text-lg transition-all ${
          active
            ? 'bg-white/12 text-amber-300'
            : 'text-white/35 hover:bg-white/[0.04] hover:text-white/60'
        }`}
      >
        {item.icon}
      </button>
      <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 rounded-lg bg-neutral-800 px-3 py-1.5 text-sm text-white/80 shadow-xl opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
        {item.label}
      </div>
    </div>
  )
}

export default function Sidebar({ view, setView }) {
  return (
    <aside className="flex w-18 flex-col items-center border-r border-white/[0.06] bg-neutral-900/60 backdrop-blur-2xl h-svh">
      <div className="flex h-16 items-center justify-center">
        <span className="text-lg font-bold text-amber-400/80">FF</span>
      </div>

      <div className="mx-3 h-px w-8 bg-white/[0.06]" />

      <nav className="flex flex-col gap-1 pt-4 px-3">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.id} item={item} view={view} setView={setView} />
        ))}
      </nav>

      <div className="mt-auto pb-6">
        <div className="group relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => setView('theme')}
            className={`flex items-center justify-center rounded-xl w-12 h-11 text-base transition-all ${
              view === 'theme'
                ? 'bg-white/12 text-amber-300'
                : 'text-white/35 hover:bg-white/[0.04] hover:text-white/60'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
          <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 rounded-lg bg-neutral-800 px-3 py-1.5 text-sm text-white/80 shadow-xl opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Theme
          </div>
        </div>
      </div>
    </aside>
  )
}

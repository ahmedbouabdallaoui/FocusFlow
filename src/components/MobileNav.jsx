const NAV_ITEMS = [
  { id: 'pomodoro', label: 'Pomodoro', icon: '◉' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'stats', label: 'Stats', icon: '◈' },
  { id: 'calendar', label: 'Calendar', icon: '☐' },
]

export default function MobileNav({ view, setView }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl lg:hidden px-2 pb-safe">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 transition-colors ${
            view === item.id
              ? 'text-[var(--accent)]'
              : 'text-[var(--text-muted)]'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-medium tracking-wider uppercase whitespace-nowrap">
            {item.label}
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => setView('theme')}
        className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-colors ${
          view === 'theme'
            ? 'text-[var(--accent)]'
            : 'text-[var(--text-muted)]'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <span className="text-[10px] font-medium tracking-wider uppercase">Theme</span>
      </button>
    </nav>
  )
}

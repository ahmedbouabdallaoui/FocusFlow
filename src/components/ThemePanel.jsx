import { useThemeStore } from '../stores/themeStore'

const ACCENTS = [
  { key: 'blue', class: 'bg-blue-500' },
  { key: 'green', class: 'bg-green-500' },
  { key: 'orange', class: 'bg-orange-500' },
  { key: 'purple', class: 'bg-purple-500' },
  { key: 'pink', class: 'bg-pink-500' },
  { key: 'teal', class: 'bg-teal-500' },
]

export default function ThemePanel() {
  const { mode, accent, setMode, setAccent } = useThemeStore()

  return (
    <div className="flex w-full max-w-xl flex-col gap-6 sm:gap-8 px-2 sm:px-0">
      <div className="flex flex-col gap-3 sm:gap-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--text-muted)]">Mode</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMode('dark')}
            className={`rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all ${
              mode === 'dark' ? 'bg-[var(--active-bg)] text-[var(--text-primary)]' : 'bg-[var(--hover-bg)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => setMode('light')}
            className={`rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all ${
              mode === 'light' ? 'bg-[var(--active-bg)] text-[var(--text-primary)]' : 'bg-[var(--hover-bg)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Light
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--text-muted)]">Accent</h2>
        <div className="flex gap-3 sm:gap-4 flex-wrap">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setAccent(a.key)}
              className={`h-9 sm:h-10 w-9 sm:w-10 rounded-full transition-all ${
                a.class} ${
                accent === a.key ? 'ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--bg-primary)] scale-110' : 'opacity-50 hover:opacity-90'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

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
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-white/40">Mode</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMode('dark')}
            className={`rounded-xl px-6 py-3 text-base font-medium transition-all ${
              mode === 'dark' ? 'bg-white/15 text-white' : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
            }`}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => setMode('light')}
            className={`rounded-xl px-6 py-3 text-base font-medium transition-all ${
              mode === 'light' ? 'bg-white/15 text-white' : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
            }`}
          >
            Light
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-white/40">Accent</h2>
        <div className="flex gap-4">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setAccent(a.key)}
              className={`h-10 w-10 rounded-full transition-all ${
                a.class} ${
                accent === a.key ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-950 scale-110' : 'opacity-50 hover:opacity-90'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

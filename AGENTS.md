# Focus Flow — AGENTS.md

## Dev commands
```sh
npm run dev        # Vite dev server (HMR)
npm run build      # production build
npm run lint       # oxlint (react/hooks, export rules)
npm run preview    # preview production build
```
No test framework installed.

## Architecture
- **Vite + React 19** — JSX, not TypeScript
- **Entry:** `src/main.jsx` → `App.jsx`
- **State:** Zustand stores in `src/stores/` (timer, tasks, sessions, theme)
- **Animations:** Framer Motion
- **Charts:** Recharts + custom `Heatmap` component
- **Dates:** date-fns
- **Audio:** Howler.js (ambient sounds in `Ambient` component)
- **Styling:** Tailwind intended but not configured yet — manually set up if adding styles

## Git
| Branch     | Who                             |
|------------|---------------------------------|
| `main`     | production — only merged via PR |
| `ahmed`    | Ahmed commits here directly     |
| `mohammed` | Mohammed commits here directly  |

**Golden rule:** never edit a file the other person owns. Check `docs/superpowers/specs/2026-06-24-focus-flow-design.md` for the full conflict map.

## Code conventions
- Components in `src/components/` — one file per component
- Stores in `src/stores/` — one file per domain (timer, tasks, sessions, theme)
- Kebab-case for CSS classes, camelCase for JS identifiers
- Use `useOptimistic` for instant optimistic UI (task toggle, etc.)
- Use `useTransition` for smooth timer state transitions

## Spec reference
Full design, Trello tickets, and task ownership at:
`docs/superpowers/specs/2026-06-24-focus-flow-design.md`

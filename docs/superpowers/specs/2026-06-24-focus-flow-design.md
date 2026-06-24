# Focus Flow — Hackathon Spec

## Overview
A Pomodoro timer + task manager with a GitHub-style heatmap tracking focus sessions over time. Built with React 19 during a 2-person hackathon.

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | React 19 |
| Styling | Tailwind CSS |
| State | Zustand |
| Animations | Framer Motion |
| Charts | Recharts + custom heatmap |
| Dates | date-fns |
| Sound | Howler.js |
| Build | Vite |

## Features

### Timer (`feature/ahmed/timer`)
- 25 min focus, 5 min short break, 15 min long break
- Radial SVG countdown animation
- Start / Pause / Reset controls
- Auto-switch between focus and break
- Desktop notifications on session end
- Sound effect on session complete (gentle chime)

### Task Manager (`feature/ahmed/tasks`)
- Add / edit / delete / reorder tasks
- Checkbox to mark complete
- Active task is highlighted; starting timer auto-links it
- useOptimistic for instant checkbox toggle
- Persisted to localStorage

### GitHub Heatmap (`feature/mohammed/heatmap`)
- 7-column grid, 52 weeks — matches GitHub profile exactly
- Each cell = number of focus sessions that day
- Color intensity scale (0 → 1-2 → 3-4 → 5-7 → 8+)
- Hover tooltip: "X sessions on Jun 24"
- Current week highlighted
- Month labels on top, day labels on left

### Streak Tracker (`feature/mohammed/stats`)
- Count consecutive days with ≥1 focus session
- Animated streak counter with flame emoji when 🔥
- All-time best streak
- "Keep it going!" / "Start a new streak" messages

### Stats Dashboard (`feature/mohammed/stats`)
- Today's session count
- This week's total sessions
- Pie chart: focus time vs break time
- Bar chart: last 7 days comparison
- All-time total focus hours

### Ambient Modes (`feature/mohammed/ambient`)
- 3 modes: Rain, Coffee Shop, Lofi
- Each has animated background (CSS) + loop audio (Howler.js)
- Toggle mode from bottom toolbar
- Mute button for audio
- Visual indicator for active mode

### Theme (`shared/theme`)
- Dark mode default
- Accent color picker (6 presets)
- Persisted to localStorage
- Smooth CSS transition on theme change

### Header
- App name + logo (simple SVG flame)
- Theme / accent toggle
- Streak badge

## Trello Tickets

### Sprint 1 — Foundation

| # | Ticket | Owner | Description |
|---|---|---|---|
| 1 | Project scaffold + Vite + Tailwind + Zustand setup | Ahmed | Init Vite React project, install deps, configure Tailwind |
| 2 | Git branching strategy + GitHub repo | Ahmed | Create repo, set up main/develop, push initial commit |
| 3 | Design system: colors, typography, ThemeProvider | Shared | Agree on palette, set CSS variables, build ThemeProvider |
| 4 | Timer component — controls + radial countdown | Ahmed | Pomodoro timer with start/pause/reset, SVG ring |
| 5 | Task CRUD + localStorage | Ahmed | Add/edit/delete tasks, persist, link active task to timer |
| 6 | Heatmap component — 52-week grid | Mohammed | Build the GitHub-style contribution grid |
| 7 | Timer → heatmap data pipeline | Mohammed | Save sessions with date, wire into heatmap color |

### Sprint 2 — Polish

| # | Ticket | Owner    | Description |
|---|---|----------|---|
| 8 | Ambient modes — Rain / Coffee / Lofi | Mohammed | Animated backgrounds + Howler.js audio loops |
| 9 | Stats dashboard — pie + bar charts | Mohammed | Recharts integration, session analytics |
| 10 | Streak tracker — logic + animation | Mohammed | Consecutive day counter, flame animation |
| 11 | Timer finish notification + sound | Ahmed    | Browser notification, chime audio on session end |
| 12 | Drag reorder tasks | Mohammed | Framer Motion's Reorder component |

### Sprint 3 — Final

| # | Ticket | Owner | Description |
|---|---|---|---|
| 13 | Accent color picker + theme persistence | Shared | 6 presets, localStorage save, CSS transition |
| 14 | Responsive layout | Shared | Mobile-friendly grid, touch targets |
| 15 | Final polish — micro-interactions | Shared | Hover states, transitions, loading skeletons |

## Git Branching Strategy

```
main                          ← production, only merged from ahmed & mohammed
 ├── ahmed                   ← Ahmed works here directly
 └── mohammed                 ← Mohammed works here directly
```

### Rules
1. **No one commits directly to `main`** — only merge via PR from `ahmed` or `mohammed` branches
2. **Ahmed works on `ahmed` branch** — commit all his work there, push daily
3. **Mohammed works on `mohammed` branch** — commit all his work there, push daily
4. **PR → `main`** — when a feature is complete, the other person reviews, then merges
5. **Before merging to `main`**, both pull `main` into their branch and resolve conflicts locally
6. **`main` must always compile** — broken code stays on personal branches

### Commit Guide to Avoid Conflicts

#### Commit Message Format
```
<type>(<scope>): <description>
```
Types: `feat` / `fix` / `style` / `refactor` / `chore`

Examples:
```
feat(timer): add radial countdown animation
feat(heatmap): render 52-week contribution grid
fix(tasks): optimistic update on toggle
style(theme): adjust accent color transitions
```

#### Golden Rules
| Rule | Why |
|---|---|
| **Commit often** (every logical piece) | Smaller diffs = fewer merge conflicts |
| **Never edit files the other person owns** | Check the Conflict Map below |
| **Pull `main` into your branch daily** | `git pull origin main` — stay in sync |
| **Message before touching shared files** | Ping the other person on Trello first |
| **One person merges shared files** | Ahmed merges App.jsx → Mohammed handles his half after |
| **Resolve conflicts on YOUR branch** | `git pull origin main`, fix, commit — never on main |

#### Typical Workflow
```bash
# Ahmed: start a day
git checkout ahmed
git pull origin main          # get Mohammed's latest
# ... code ...
git add -A && git commit -m "feat(timer): add pause/resume"
git push origin ahmed

# Mohammed: same flow
git checkout mohammed
git pull origin main          # get Ahmed's latest
# ... code ...
git add -A && git commit -m "feat(heatmap): add tooltip on hover"
git push origin mohammed

# Merging to main (done by either person after review)
git checkout main
git pull origin main
git merge ahmed               # or git merge mohammed
git push origin main
```

### Conflict Map (who touches what)

| File | Ahmed | Mohammed |
|---|---|---|
| `src/components/Timer.jsx` | ✅ owns | ❌ stay off |
| `src/components/TaskList.jsx` | ✅ owns | ❌ stay off |
| `src/components/Heatmap.jsx` | ❌ stay off | ✅ owns |
| `src/components/Stats.jsx` | ❌ stay off | ✅ owns |
| `src/components/Ambient.jsx` | ❌ stay off | ✅ owns |
| `src/components/ThemeProvider.jsx` | ⚠️ coordinate | ⚠️ coordinate |
| `src/stores/timerStore.js` | ✅ owns | ❌ stay off |
| `src/stores/taskStore.js` | ✅ owns | ❌ stay off |
| `src/stores/sessionStore.js` | ❌ stay off | ✅ owns |
| `src/stores/themeStore.js` | ⚠️ coordinate | ⚠️ coordinate |
| `src/App.jsx` | ⚠️ coordinate | ⚠️ coordinate |
| `src/index.css` | ✅ both — append only | ✅ both — append only |

## State Shape (Zustand)

```ts
// timerStore
{ mode: 'focus' | 'shortBreak' | 'longBreak',
  secondsLeft: number,
  isRunning: boolean,
  activeTaskId: string | null }

// taskStore
{ tasks: { id, title, done, order }[] }

// sessionStore
{ sessions: { date: string, count: number }[] }  // {date: '2026-06-24', count: 3}

// themeStore
{ mode: 'dark' | 'light',
  accent: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'teal' }
```

## Component Tree

```
App
├── Header (logo, streak, theme toggle)
├── Timer (radial countdown, mode tabs, controls)
├── TaskList (add input, reorderable list)
├── Dashboard
│   ├── Heatmap (7×52 grid)
│   ├── Stats (pie chart, bar chart, summary)
│   └── StreakBadge
└── AmbientBar (mode selector, mute button)
```

## Success Criteria
- App runs with `npm run dev`
- Timer counts down, switches modes, fires notification
- Tasks add/edit/delete/complete with optimistic UI
- Heatmap shows real session data
- Stats charts render correctly
- Ambient modes play audio + show animation
- Theme + accent persist on refresh
- Responsive down to 375px width

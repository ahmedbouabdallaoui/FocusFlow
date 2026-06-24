import { useState, useOptimistic } from 'react'
import { Reorder, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '../stores/taskStore'
import { useTimerStore } from '../stores/timerStore'
import TaskForm from './TaskForm'

export default function TaskList() {
  const { tasks, deleteTask, toggleTask, reorderTasks } = useTaskStore()
  const { activeTaskId, setActiveTask } = useTimerStore()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  const [optimisticTasks, addOptimisticToggle] = useOptimistic(
    tasks,
    (state, toggledId) =>
      state.map((t) => (t.id === toggledId ? { ...t, done: !t.done } : t)),
  )

  function handleToggle(id) {
    addOptimisticToggle(id)
    toggleTask(id)
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditValue(task.title)
  }

  function submitEdit(id) {
    const { editTask } = useTaskStore.getState()
    const title = editValue.trim()
    if (title) editTask(id, { title })
    setEditingId(null)
  }

  function handleKeyDown(e, id) {
    if (e.key === 'Enter') submitEdit(id)
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-white/40">Tasks</h2>
        <button
          type="button"
          onClick={() => setFormOpen(!formOpen)}
          className="rounded-lg border border-white/[0.08] px-4 py-1.5 text-sm font-medium text-white/50 transition-colors hover:border-white/25 hover:text-white/80"
        >
          {formOpen ? '−' : '+'}
        </button>
      </div>

      <TaskForm open={formOpen} onClose={() => setFormOpen(false)} />

      <Reorder.Group
        axis="y"
        values={optimisticTasks}
        onReorder={reorderTasks}
        className="flex flex-col gap-0.5"
      >
        <AnimatePresence>
          {optimisticTasks.map((task) => (
            <Reorder.Item
              key={task.id}
              value={task}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                task.id === activeTaskId
                  ? 'bg-amber-400/10 ring-1 ring-amber-400/25'
                  : 'hover:bg-white/[0.03]'
              }`}
              onClick={() => setActiveTask(task.id)}
              style={{ cursor: 'grab' }}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggle(task.id)}
                className="h-5 w-5 cursor-pointer rounded border-white/20 bg-white/5 accent-amber-500 shrink-0"
              />
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => submitEdit(task.id)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  autoFocus
                  className="flex-1 bg-transparent text-base text-white outline-none"
                />
              ) : (
                <div className="flex flex-1 flex-col">
                  <span
                    className={`text-base ${
                      task.done ? 'text-white/20 line-through' : 'text-white/80'
                    }`}
                    onDoubleClick={() => startEdit(task)}
                  >
                    {task.title}
                  </span>
                  {task.description && (
                    <span className="text-sm text-white/30 line-clamp-1">{task.description}</span>
                  )}
                  <div className="flex gap-3 mt-1">
                    {task.dueDate && (
                      <span className="text-xs text-white/25">{task.dueDate}</span>
                    )}
                    {task.priority && task.priority !== 'medium' && (
                      <span className={`text-xs ${
                        task.priority === 'high' ? 'text-amber-400/70' : 'text-white/25'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                    {task.estimatedPomodoros > 1 && (
                      <span className="text-xs text-white/25">{task.estimatedPomodoros} pom</span>
                    )}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteTask(task.id)
                }}
                className="text-sm text-white/20 opacity-0 transition-all hover:text-white/50 group-hover:opacity-100"
              >
                ✕
              </button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}

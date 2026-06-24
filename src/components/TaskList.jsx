import { useState, useOptimistic, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '../stores/taskStore'
import { useTimerStore } from '../stores/timerStore'

export default function TaskList() {
  const { tasks, addTask, editTask, deleteTask, toggleTask } = useTaskStore()
  const { activeTaskId, setActiveTask } = useTimerStore()
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef(null)

  const [optimisticTasks, addOptimisticToggle] = useOptimistic(
    tasks,
    (state, toggledId) =>
      state.map((t) => (t.id === toggledId ? { ...t, done: !t.done } : t)),
  )

  function handleSubmit(e) {
    e.preventDefault()
    const title = input.trim()
    if (!title) return
    addTask(title)
    setInput('')
    inputRef.current?.focus()
  }

  function handleToggle(id) {
    addOptimisticToggle(id)
    toggleTask(id)
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditValue(task.title)
  }

  function submitEdit(id) {
    const title = editValue.trim()
    if (title) editTask(id, title)
    setEditingId(null)
  }

  function handleKeyDown(e, id) {
    if (e.key === 'Enter') submitEdit(id)
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30"
        />
        <button
          type="submit"
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          Add
        </button>
      </form>

      <div className="flex flex-col gap-1">
        <AnimatePresence>
          {optimisticTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                task.id === activeTaskId
                  ? 'bg-white/15 ring-1 ring-white/20'
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveTask(task.id)}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggle(task.id)}
                className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 accent-white"
              />
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => submitEdit(task.id)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-white outline-none"
                />
              ) : (
                <span
                  className={`flex-1 cursor-pointer text-sm ${
                    task.done ? 'text-white/30 line-through' : 'text-white/80'
                  }`}
                  onDoubleClick={() => startEdit(task)}
                >
                  {task.title}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteTask(task.id)
                }}
                className="text-xs text-white/30 transition-colors hover:text-white/60"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

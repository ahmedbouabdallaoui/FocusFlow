import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '../stores/taskStore'

export default function TaskForm({ open, onClose }) {
  const { addTask } = useTaskStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)
  const [priority, setPriority] = useState('medium')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    addTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      estimatedPomodoros,
      priority,
    })
    setTitle('')
    setDescription('')
    setDueDate('')
    setEstimatedPomodoros(1)
    setPriority('medium')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-white/25 outline-none transition-colors focus:border-white/30"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white/30"
            />
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider uppercase text-white/35">Due</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30 [color-scheme:dark]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider uppercase text-white/35">Pomodoros</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={estimatedPomodoros}
                  onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30 [color-scheme:dark]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider uppercase text-white/35">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-white/12 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/25"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/12 px-6 py-3 text-sm text-white/45 transition-colors hover:border-white/30 hover:text-white/80"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

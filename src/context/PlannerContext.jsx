import React, { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_CATEGORIES, PALETTE, getOccurrences, getDeadlineOnDate } from '../utils/planner'

const PlannerContext = createContext(null)

export function PlannerProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('rk_tasks', [])
  const [categories, setCategories] = useLocalStorage('rk_categories', DEFAULT_CATEGORIES)
  const [completions, setCompletions] = useLocalStorage('rk_completions', {})

  function toggleCompletion(taskId, key) {
    setCompletions((prev) => {
      const current = prev[taskId] || {}
      return { ...prev, [taskId]: { ...current, [key]: !current[key] } }
    })
  }

  function markAllDone(dateStr) {
    const scheduled = getOccurrences(tasks, dateStr)
    const deadlined = getDeadlineOnDate(tasks, dateStr)
    const seenIds = new Set(scheduled.map((t) => t.id))
    const extra = deadlined.filter((t) => !seenIds.has(t.id))
    setCompletions((prev) => {
      const next = { ...prev }
      scheduled.forEach((t) => {
        next[t.id] = { ...(next[t.id] || {}), [dateStr]: true }
      })
      extra.forEach((t) => {
        next[t.id] = { ...(next[t.id] || {}), deadline: true }
      })
      return next
    })
  }

  function addCategory(name) {
    const id = 'c' + Date.now()
    const color = PALETTE[categories.length % PALETTE.length]
    setCategories((prev) => [...prev, { id, name, color }])
    return id
  }

  function saveTask(task, editingId) {
    if (editingId) {
      setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...task } : t)))
    } else {
      const id = 't' + Date.now() + Math.random().toString(36).slice(2, 6)
      setTasks((prev) => [...prev, { id, ...task }])
    }
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setCompletions((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const value = {
    tasks,
    categories,
    completions,
    toggleCompletion,
    markAllDone,
    addCategory,
    saveTask,
    deleteTask,
  }

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider')
  return ctx
}

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

  // Export all planner data to a downloadable JSON file
  function exportData() {
    const payload = {
      app: 'PlanIt',
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
      completions,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `planit-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import planner data from a parsed JSON object. Returns { ok, message }.
  function importData(parsed, { merge = false } = {}) {
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.tasks)) {
      return { ok: false, message: 'File tidak valid atau bukan backup PlanIt.' }
    }

    const incomingTasks = parsed.tasks || []
    const incomingCategories = Array.isArray(parsed.categories) ? parsed.categories : []
    const incomingCompletions = parsed.completions && typeof parsed.completions === 'object' ? parsed.completions : {}

    if (merge) {
      // Merge: keep existing, add new ones (by id) without duplicating
      setTasks((prev) => {
        const ids = new Set(prev.map((t) => t.id))
        return [...prev, ...incomingTasks.filter((t) => !ids.has(t.id))]
      })
      setCategories((prev) => {
        const ids = new Set(prev.map((c) => c.id))
        return [...prev, ...incomingCategories.filter((c) => !ids.has(c.id))]
      })
      setCompletions((prev) => ({ ...prev, ...incomingCompletions }))
    } else {
      // Replace everything
      setTasks(incomingTasks)
      setCategories(incomingCategories.length ? incomingCategories : DEFAULT_CATEGORIES)
      setCompletions(incomingCompletions)
    }

    return { ok: true, message: `${incomingTasks.length} tugas berhasil dimuat.` }
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
    exportData,
    importData,
  }

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider')
  return ctx
}

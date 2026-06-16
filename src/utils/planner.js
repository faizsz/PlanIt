import { parseDate } from './dates'

export const PALETTE = ['#4C84B0', '#C97B63', '#6E9B6B', '#7C6FB0', '#C77FA0', '#D9A23D', '#5C9EA8', '#A0708C']

export const DEFAULT_CATEGORIES = [
  { id: 'umum', name: 'Umum', color: '#9B9686' },
  { id: 'kuliah', name: 'Kuliah', color: '#4C84B0' },
  { id: 'kerja', name: 'Kerja', color: '#C97B63' },
  { id: 'pribadi', name: 'Pribadi', color: '#6E9B6B' },
]

// Returns tasks scheduled to occur on a given YYYY-MM-DD date, sorted by start time.
export function getOccurrences(tasks, dateStr) {
  const dow = parseDate(dateStr).getDay()
  return tasks
    .filter((t) => {
      if (!t.schedule) return false
      const s = t.schedule
      if (!s.recurring) return s.date === dateStr
      if (dateStr < s.startDate) return false
      if (s.endDate && dateStr > s.endDate) return false
      return s.days.includes(dow)
    })
    .sort((a, b) => (a.schedule.startTime || '').localeCompare(b.schedule.startTime || ''))
}

export function isDone(completions, taskId, key) {
  return !!(completions[taskId] && completions[taskId][key])
}

// Returns tasks that have a deadline on the given date.
export function getDeadlineOnDate(tasks, dateStr) {
  return tasks.filter((t) => t.deadline && t.deadline.date === dateStr)
}

// Returns all tasks relevant to a given date (scheduled OR deadline on that date), deduplicated.
export function getAllTasksForDate(tasks, dateStr) {
  const scheduled = getOccurrences(tasks, dateStr)
  const deadlined = getDeadlineOnDate(tasks, dateStr)
  const seen = new Set(scheduled.map((t) => t.id))
  const extra = deadlined.filter((t) => !seen.has(t.id))
  return [...scheduled, ...extra]
}

// Splits tasks with a deadline into overdue / upcoming, sorted by date+time.
export function getDeadlineTasks(tasks, completions, showCompleted) {
  const now = new Date()
  const items = tasks.filter((t) => t.deadline && (showCompleted || !isDone(completions, t.id, 'deadline')))
  const overdue = []
  const upcoming = []
  items.forEach((t) => {
    const dt = new Date(`${t.deadline.date}T${t.deadline.time || '23:59'}`)
    if (dt < now && !isDone(completions, t.id, 'deadline')) overdue.push({ ...t, dt })
    else upcoming.push({ ...t, dt })
  })
  overdue.sort((a, b) => a.dt - b.dt)
  upcoming.sort((a, b) => a.dt - b.dt)
  return { overdue, upcoming }
}

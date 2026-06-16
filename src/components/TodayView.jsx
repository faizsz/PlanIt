import { DAY_LONG, MONTHS, dstr } from '../utils/dates'
import { usePlanner } from '../context/PlannerContext'
import { useUI } from '../context/UIContext'
import { getOccurrences, getDeadlineOnDate, isDone } from '../utils/planner'
import WeekStrip from './WeekStrip'
import TaskRow from './TaskRow'

export default function TodayView({ focused, setFocused, onEdit }) {
  const { tasks, categories, completions, toggleCompletion, markAllDone, deleteTask } = usePlanner()
  const { confirm, toast } = useUI()
  const fStr = dstr(focused)
  const scheduled = getOccurrences(tasks, fStr)
  const deadlined = getDeadlineOnDate(tasks, fStr)
  // Merge scheduled + deadline tasks, deduplicated
  const seenIds = new Set(scheduled.map((t) => t.id))
  const extra = deadlined.filter((t) => !seenIds.has(t.id))
  const occurrences = [...scheduled, ...extra]
  const allDone = occurrences.length > 0 && occurrences.every((t) => {
    // Scheduled tasks use date string as key, deadline-only tasks use 'deadline'
    const key = t.schedule ? fStr : 'deadline'
    return isDone(completions, t.id, key)
  })

  async function handleDelete(t) {
    const ok = await confirm({
      title: 'Hapus tugas?',
      message: `"${t.title}" akan dihapus permanen.`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      danger: true,
    })
    if (!ok) return
    deleteTask(t.id)
    toast('Tugas dihapus.', { type: 'success' })
  }

  return (
    <div>
      <WeekStrip focused={focused} setFocused={setFocused} />

      <div className="flex items-center justify-between gap-2.5 flex-wrap mb-3">
        <h2 className="font-display text-lg font-semibold m-0">
          {DAY_LONG[focused.getDay()]}, {focused.getDate()} {MONTHS[focused.getMonth()]} {focused.getFullYear()}
        </h2>
        {occurrences.length > 0 && !allDone && (
          <button
            onClick={() => markAllDone(fStr)}
            className="border border-line bg-surface text-ink text-[13px] font-medium px-3 py-1.5 rounded-full hover:border-teal hover:text-teal"
          >
            Tandai semua selesai
          </button>
        )}
        {allDone && (
          <span className="text-sm text-teal font-medium bg-teal-light px-2.5 py-1.5 rounded-full">
            Semua sudah selesai ✓
          </span>
        )}
      </div>

      {occurrences.length === 0 ? (
        <div className="text-center text-ink-soft text-sm py-8 px-4 bg-surface border border-dashed border-line rounded-2xl">
          Belum ada jadwal di hari ini. Ketuk tombol + untuk menambahkan.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {occurrences.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId) || categories[0]
            const isScheduled = !!t.schedule
            const completionKey = isScheduled ? fStr : 'deadline'
            const done = isDone(completions, t.id, completionKey)
            let time = ''
            if (isScheduled && t.schedule.startTime) {
              time = `${t.schedule.startTime}${t.schedule.endTime ? '\u2013' + t.schedule.endTime : ''}`
            } else if (!isScheduled && t.deadline) {
              time = t.deadline.time ? `Deadline ${t.deadline.time}` : 'Deadline'
            }
            return (
              <TaskRow
                key={t.id}
                title={t.title}
                categoryName={cat.name}
                categoryColor={cat.color}
                timeLabel={time}
                done={done}
                onToggle={() => toggleCompletion(t.id, completionKey)}
                onEdit={() => onEdit(t.id)}
                onDelete={() => handleDelete(t)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

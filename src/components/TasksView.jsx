import { useState } from 'react'
import { MONTHS, parseDate } from '../utils/dates'
import { usePlanner } from '../context/PlannerContext'
import { useUI } from '../context/UIContext'
import { getDeadlineTasks } from '../utils/planner'
import TaskRow from './TaskRow'

export default function TasksView({ onEdit }) {
  const { tasks, categories, completions, toggleCompletion, deleteTask } = usePlanner()
  const { confirm, toast } = useUI()
  const [showCompleted, setShowCompleted] = useState(false)
  const { overdue, upcoming } = getDeadlineTasks(tasks, completions, showCompleted)

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

  function renderCard(t, overdueFlag) {
    const cat = categories.find((c) => c.id === t.categoryId) || categories[0]
    const done = !!(completions[t.id] && completions[t.id].deadline)
    const dd = parseDate(t.deadline.date)
    const dateLabel = `${dd.getDate()} ${MONTHS[dd.getMonth()]} ${dd.getFullYear()}`
    const timeLabel = dateLabel + (t.deadline.time ? `, ${t.deadline.time}` : '')
    return (
      <TaskRow
        key={t.id}
        title={t.title}
        categoryName={cat.name}
        categoryColor={cat.color}
        timeLabel={timeLabel}
        done={done}
        overdue={overdueFlag}
        onToggle={() => toggleCompletion(t.id, 'deadline')}
        onEdit={() => onEdit(t.id)}
        onDelete={() => handleDelete(t)}
      />
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="font-display text-[15px] font-semibold flex items-center gap-2 mb-2.5 text-rust">
          Lewat deadline
          {overdue.length > 0 && (
            <span className="font-sans text-xs font-semibold bg-rust-light text-rust rounded-full px-2 py-0.5">
              {overdue.length}
            </span>
          )}
        </h3>
        {overdue.length > 0 ? (
          <div className="flex flex-col gap-2">{overdue.map((t) => renderCard(t, true))}</div>
        ) : (
          <div className="text-center text-ink-soft text-[13px] py-4 px-4 bg-surface border border-dashed border-line rounded-2xl">
            Tidak ada yang terlambat.
          </div>
        )}
      </div>

      <div className="mb-5">
        <h3 className="font-display text-[15px] font-semibold flex items-center gap-2 mb-2.5">
          Belum deadline
          {upcoming.length > 0 && (
            <span className="font-sans text-xs font-semibold bg-line text-ink-soft rounded-full px-2 py-0.5">
              {upcoming.length}
            </span>
          )}
        </h3>
        {upcoming.length > 0 ? (
          <div className="flex flex-col gap-2">{upcoming.map((t) => renderCard(t, false))}</div>
        ) : (
          <div className="text-center text-ink-soft text-[13px] py-4 px-4 bg-surface border border-dashed border-line rounded-2xl">
            Tidak ada tugas mendatang.
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-[13px] text-ink-soft cursor-pointer">
        <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />
        Tampilkan yang sudah selesai
      </label>
    </div>
  )
}

import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import Fab from './components/Fab'
import TodayView from './components/TodayView'
import CalendarModal from './components/CalendarModal'
import TasksView from './components/TasksView'
import TaskModal from './components/TaskModal'
import DataMenu from './components/DataMenu'
import { ThemeToggle } from './components/ui/theme-toggle'

export default function App() {
  const [focused, setFocused] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [calOpen, setCalOpen] = useState(false)

  function openAdd() {
    setEditingId(null)
    setModalOpen(true)
  }

  function openEdit(id) {
    setEditingId(id)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
  }

  function pickDate(d) {
    setFocused(d)
    setCalOpen(false)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 sm:px-12 pt-5 pb-24">
      <header className="pt-1.5 pb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[28px] font-bold m-0 mb-1 tracking-tight">PlanIt</h1>
          <p className="m-0 text-ink-soft text-sm">
            Atur jadwal, rencana, dan deadline kamu di satu tempat. Data tersimpan di perangkat ini saja (localStorage).
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCalOpen(true)}
            aria-label="Buka kalender"
            className="flex items-center gap-2 h-11 px-4 rounded-full border border-line bg-surface text-ink-soft hover:text-teal hover:border-teal transition-colors text-sm font-medium"
          >
            <CalendarIcon className="w-5 h-5" strokeWidth={1.8} />
            Kalender
          </button>
          <DataMenu />
          <ThemeToggle />
        </div>
      </header>

      {/* layout: today + tasks */}
      <div className="flex flex-col lg:flex-row gap-5 lg:items-start">
        {/* Center: Today */}
        <div className="order-1 flex-1 min-w-0">
          <div className="bg-surface border border-line rounded-2xl p-4">
            <TodayView focused={focused} setFocused={setFocused} onEdit={openEdit} />
          </div>
        </div>

        {/* Right: Tasks/Deadlines */}
        <div className="order-2 lg:w-[420px] lg:shrink-0">
          <div className="bg-surface border border-line rounded-2xl p-4">
            <h2 className="font-display text-lg font-semibold m-0 mb-3">Tugas & Deadline</h2>
            <TasksView onEdit={openEdit} />
          </div>
        </div>
      </div>

      <Fab onClick={openAdd} />

      {calOpen && <CalendarModal focused={focused} setFocused={pickDate} onClose={() => setCalOpen(false)} />}
      {modalOpen && <TaskModal taskId={editingId} onClose={closeModal} />}
    </div>
  )
}

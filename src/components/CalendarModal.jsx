import { X } from 'lucide-react'
import CalendarView from './CalendarView'

export default function CalendarModal({ focused, setFocused, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface w-full sm:max-w-lg max-h-[90vh] rounded-3xl border border-line shadow-2xl flex flex-col overflow-hidden mt-12 sm:mt-0">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="font-display text-lg font-semibold m-0">Kalender</h2>
          <button
            onClick={onClose}
            aria-label="Tutup kalender"
            className="flex items-center justify-center w-9 h-9 rounded-full text-ink-soft hover:text-ink hover:bg-line/60"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <div className="px-5 pb-5 flex-1 min-h-0 flex flex-col">
          <CalendarView focused={focused} setFocused={setFocused} />
        </div>
      </div>
    </div>
  )
}

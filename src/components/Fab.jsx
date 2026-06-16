import { Plus } from 'lucide-react'

export default function Fab({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Tambahkan rencana kamu"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 pl-5 pr-3 py-3 rounded-full bg-teal text-white shadow-lg shadow-black/20 cursor-pointer hover:scale-[1.03] active:scale-95 transition-transform"
    >
      <span className="text-sm font-semibold whitespace-nowrap">Tambahkan rencana kamu</span>
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
        <Plus className="w-5 h-5" strokeWidth={2.4} />
      </span>
    </button>
  )
}

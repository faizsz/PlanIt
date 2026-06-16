import { AlertTriangle, HelpCircle } from 'lucide-react'

export default function ConfirmDialog({ title, message, confirmText, cancelText, danger, onResult }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onResult(false) }}
    >
      <div className="bg-surface w-full max-w-sm rounded-3xl border border-line shadow-2xl p-6 animate-[pop_0.18s_ease-out]">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
            danger ? 'bg-rust-light text-rust' : 'bg-teal-light text-teal'
          }`}>
            {danger ? (
              <AlertTriangle className="w-6 h-6" strokeWidth={1.8} />
            ) : (
              <HelpCircle className="w-6 h-6" strokeWidth={1.8} />
            )}
          </div>
          <h3 className="font-display text-lg font-semibold m-0">{title}</h3>
          {message && <p className="m-0 text-sm text-ink-soft leading-relaxed">{message}</p>}
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={() => onResult(false)}
            className="flex-1 border border-line bg-surface text-ink text-sm font-medium px-4 py-2.5 rounded-xl hover:border-ink-soft transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => onResult(true)}
            className={`flex-1 font-display font-semibold text-sm px-4 py-2.5 rounded-xl text-white transition-colors ${
              danger ? 'bg-rust hover:opacity-90' : 'bg-teal hover:opacity-90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

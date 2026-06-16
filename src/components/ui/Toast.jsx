import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const STYLES = {
  success: 'text-teal',
  error: 'text-rust',
  warning: 'text-amber',
  info: 'text-ink-soft',
}

export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-surface border border-line rounded-2xl shadow-lg shadow-black/10 px-4 py-3 animate-[slidedown_0.22s_ease-out] pointer-events-auto"
          >
            <Icon className={`w-5 h-5 shrink-0 ${STYLES[t.type] || STYLES.info}`} strokeWidth={2} />
            <span className="text-sm text-ink leading-snug">{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}

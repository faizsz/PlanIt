export default function TaskRow({ title, categoryName, categoryColor, timeLabel, done, overdue, onToggle, onEdit, onDelete }) {
  return (
    <div className={`flex items-start gap-2.5 bg-surface border rounded-2xl p-3 ${
      overdue ? 'border-rust' : 'border-line'
    } ${done ? 'opacity-55' : ''}`}>
      <button
        onClick={onToggle}
        aria-label="Tandai selesai"
        className={`checkbox-mark flex-none w-[22px] h-[22px] mt-px rounded-lg border-[1.5px] cursor-pointer ${
          done ? 'checked bg-teal border-teal' : 'border-line bg-surface'
        }`}
      />
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-[15px] leading-snug break-words ${done ? 'line-through' : ''}`}>
          {title}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {timeLabel && (
            <span className={`font-mono text-xs ${overdue ? 'text-rust font-medium' : 'text-ink-soft'}`}>
              {timeLabel}
            </span>
          )}
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: categoryColor + '22', color: categoryColor }}
          >
            {categoryName}
          </span>
        </div>
      </div>
      <div className="flex-none flex flex-col items-end">
        <button onClick={onEdit} className="text-xs text-ink-soft hover:text-teal underline decoration-transparent hover:decoration-teal px-1.5 py-1">
          Ubah
        </button>
        <button onClick={onDelete} className="text-xs text-ink-soft hover:text-rust underline decoration-transparent hover:decoration-rust px-1.5 py-1">
          Hapus
        </button>
      </div>
    </div>
  )
}

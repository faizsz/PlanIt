import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DAY_SHORT, WEEK_ORDER, MONTHS, dstr, todayStr } from '../utils/dates'
import { usePlanner } from '../context/PlannerContext'
import { getAllTasksForDate } from '../utils/planner'

export default function CalendarView({ setFocused, focused }) {
  const { tasks, categories } = usePlanner()
  const [calMonth, setCalMonth] = useState(() => {
    const base = focused || new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const year = calMonth.getFullYear()
  const month = calMonth.getMonth()
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = todayStr()
  const focusedStr = focused ? dstr(focused) : null

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // pad to full weeks so the grid is even
  while (cells.length % 7 !== 0) cells.push(null)

  function goto(d) {
    setFocused(new Date(year, month, d))
  }

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <button
          onClick={() => setCalMonth(new Date(year, month - 1, 1))}
          aria-label="Bulan sebelumnya"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-soft hover:text-teal hover:bg-teal-light shrink-0"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <h2 className="font-display text-base font-semibold m-0 text-center flex-1 whitespace-nowrap">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={() => setCalMonth(new Date(year, month + 1, 1))}
          aria-label="Bulan berikutnya"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-soft hover:text-teal hover:bg-teal-light shrink-0"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* weekday labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEK_ORDER.map((i) => (
          <div key={i} className="text-center text-[11px] text-ink-soft uppercase tracking-wide">
            {DAY_SHORT[i]}
          </div>
        ))}
      </div>

      {/* day grid - fills remaining height */}
      <div className="grid grid-cols-7 gap-1.5 flex-1 auto-rows-fr min-h-0">
        {cells.map((d, idx) => {
          if (d === null) return <div key={'e' + idx} />
          const ds = dstr(new Date(year, month, d))
          const occ = getAllTasksForDate(tasks, ds)
          const cats = [...new Set(occ.map((t) => t.categoryId))].slice(0, 4)
          const isToday = ds === today
          const isSelected = ds === focusedStr
          return (
            <button
              key={ds}
              onClick={() => goto(d)}
              className={`relative flex flex-col items-center justify-center rounded-xl border transition-colors min-h-[40px] ${
                isSelected
                  ? 'border-teal border-2 bg-teal-light'
                  : isToday
                  ? 'border-teal border-dashed bg-surface'
                  : 'border-line bg-surface hover:border-teal'
              }`}
            >
              <span
                className={`font-display font-semibold leading-none text-[15px] ${
                  isSelected ? 'text-teal' : isToday ? 'text-teal' : ''
                }`}
              >
                {d}
              </span>
              {cats.length > 0 && (
                <span className="mt-1.5 flex justify-center gap-1 h-[6px]">
                  {cats.map((cid) => {
                    const c = categories.find((x) => x.id === cid)
                    return (
                      <span
                        key={cid}
                        className="w-[6px] h-[6px] rounded-full"
                        style={{ background: c ? c.color : '#999' }}
                      />
                    )
                  })}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

import { DAY_SHORT, addDays, dstr, getWeekStart, todayStr } from '../utils/dates'
import { usePlanner } from '../context/PlannerContext'
import { getAllTasksForDate } from '../utils/planner'

export default function WeekStrip({ focused, setFocused }) {
  const { tasks, categories } = usePlanner()
  const weekStart = getWeekStart(focused)
  const focusedStr = dstr(focused)
  const today = todayStr()

  return (
    <div className="flex gap-1.5 mb-4">
      {Array.from({ length: 7 }, (_, i) => {
        const d = addDays(weekStart, i)
        const ds = dstr(d)
        const occ = getAllTasksForDate(tasks, ds)
        const cats = [...new Set(occ.map((t) => t.categoryId))].slice(0, 4)
        const isToday = ds === today
        const isActive = ds === focusedStr
        return (
          <button
            key={ds}
            onClick={() => setFocused(d)}
            className={`flex-1 flex flex-col items-center gap-1 rounded-2xl border py-2 px-0.5 ${
              isActive ? 'bg-teal border-teal text-white' : 'bg-surface border-line text-ink'
            }`}
          >
            <span className={`text-[11px] uppercase tracking-wide ${
              isActive ? 'text-white/80' : isToday ? 'text-teal' : 'text-ink-soft'
            }`}>
              {DAY_SHORT[d.getDay()]}
            </span>
            <span className="font-display font-semibold text-base">{d.getDate()}</span>
            <span className="flex justify-center gap-0.5 h-1.5">
              {cats.map((cid) => {
                const c = categories.find((x) => x.id === cid)
                return (
                  <span
                    key={cid}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isActive ? '#fff' : (c ? c.color : '#999') }}
                  />
                )
              })}
            </span>
          </button>
        )
      })}
    </div>
  )
}

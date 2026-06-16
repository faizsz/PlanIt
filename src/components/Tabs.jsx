const TABS = [
  { id: 'today', label: 'Hari ini' },
  { id: 'calendar', label: 'Kalender' },
  { id: 'tasks', label: 'Tugas' },
]

export default function Tabs({ view, setView }) {
  return (
    <nav className="flex gap-1.5 bg-surface border border-line rounded-2xl p-1 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`flex-1 font-display font-semibold text-sm py-2.5 px-2 rounded-xl transition-colors ${
            view === tab.id ? 'bg-teal text-white' : 'text-ink-soft hover:text-ink'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

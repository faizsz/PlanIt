import { useState } from 'react'
import { WEEK_ORDER, DAY_SHORT, todayStr } from '../utils/dates'
import { usePlanner } from '../context/PlannerContext'
import { useUI } from '../context/UIContext'

export default function TaskModal({ taskId, onClose }) {
  const { tasks, categories, addCategory, saveTask, deleteTask } = usePlanner()
  const { toast, confirm } = useUI()
  const editing = taskId ? tasks.find((t) => t.id === taskId) : null
  const sch = editing?.schedule || null
  const dl = editing?.deadline || null

  const [title, setTitle] = useState(editing?.title || '')
  const [categoryId, setCategoryId] = useState(editing?.categoryId || categories[0]?.id || '')
  const [newCategory, setNewCategory] = useState('')

  const [hasSchedule, setHasSchedule] = useState(!!sch)
  const [recurring, setRecurring] = useState(sch ? sch.recurring : true)
  const [singleDate, setSingleDate] = useState(!sch?.recurring && sch ? sch.date : '')
  const [days, setDays] = useState(sch?.days || [])
  const [startDate, setStartDate] = useState(sch?.startDate || '')
  const [endDate, setEndDate] = useState(sch?.endDate || '')
  const [startTime, setStartTime] = useState(sch?.startTime || '')
  const [endTime, setEndTime] = useState(sch?.endTime || '')

  const [hasDeadline, setHasDeadline] = useState(!!dl)
  const [deadlineDate, setDeadlineDate] = useState(dl?.date || '')
  const [deadlineTime, setDeadlineTime] = useState(dl?.time || '')

  function toggleDay(i) {
    setDays((prev) => (prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i]))
  }

  async function handleSave() {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast('Judul tugas wajib diisi.', { type: 'warning' })
      return
    }

    let finalCategoryId = categoryId
    const trimmedNewCat = newCategory.trim()
    if (trimmedNewCat) {
      finalCategoryId = addCategory(trimmedNewCat)
    }

    let schedule = null
    if (hasSchedule) {
      if (recurring) {
        schedule = {
          recurring: true,
          days,
          startDate: startDate || todayStr(),
          endDate: endDate || null,
          startTime,
          endTime,
        }
      } else {
        schedule = {
          recurring: false,
          date: singleDate || todayStr(),
          startTime,
          endTime,
        }
      }
    }

    let deadline = null
    if (hasDeadline && deadlineDate) {
      deadline = { date: deadlineDate, time: deadlineTime }
    }

    if (!schedule && !deadline) {
      const ok = await confirm({
        title: 'Tanpa jadwal & deadline',
        message:
          'Tugas ini belum punya jadwal atau deadline, jadi belum akan muncul di kalender / daftar tugas. Tetap simpan?',
        confirmText: 'Tetap simpan',
        cancelText: 'Batal',
      })
      if (!ok) return
    }

    saveTask({ title: trimmedTitle, categoryId: finalCategoryId, schedule, deadline }, taskId)
    toast(editing ? 'Tugas berhasil diperbarui.' : 'Tugas berhasil ditambahkan.', { type: 'success' })
    onClose()
  }

  async function handleDelete() {
    const ok = await confirm({
      title: 'Hapus tugas?',
      message: 'Tugas ini akan dihapus permanen dan tidak bisa dikembalikan.',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      danger: true,
    })
    if (!ok) return
    deleteTask(taskId)
    toast('Tugas dihapus.', { type: 'success' })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5">
        <h2 className="font-display text-[19px] font-semibold mb-3.5">
          {editing ? 'Ubah tugas' : 'Tambah tugas'}
        </h2>

        <label className="flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
          <span>Judul</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Kuliah Aljabar / Laporan praktikum"
            className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
          <span>Kategori</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
          <span>Atau buat kategori baru (opsional)</span>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nama kategori baru"
            className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium my-3.5 cursor-pointer">
          <input type="checkbox" className="w-[18px] h-[18px]" checked={hasSchedule} onChange={(e) => setHasSchedule(e.target.checked)} />
          <span>Punya jadwal waktu (muncul di kalender &amp; hari ini)</span>
        </label>

        {hasSchedule && (
          <div className="border-l-2 border-line pl-3 mb-1.5">
            <div className="flex gap-4 text-[13px] mb-2.5">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="recurring" checked={!recurring} onChange={() => setRecurring(false)} />
                Sekali
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="recurring" checked={recurring} onChange={() => setRecurring(true)} />
                Berulang setiap minggu
              </label>
            </div>

            {!recurring && (
              <label className="flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                <span>Tanggal</span>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
                />
              </label>
            )}

            {recurring && (
              <div>
                <div className="flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                  <span>Hari</span>
                  <div className="flex gap-1 flex-wrap">
                    {WEEK_ORDER.map((i) => (
                      <label
                        key={i}
                        className="flex items-center gap-1 text-xs border border-line rounded-full px-2.5 py-1.5 cursor-pointer text-ink-soft"
                      >
                        <input type="checkbox" checked={days.includes(i)} onChange={() => toggleDay(i)} className="m-0" />
                        {DAY_SHORT[i]}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <label className="flex-1 flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                    <span>Mulai tanggal</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
                    />
                  </label>
                  <label className="flex-1 flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                    <span>Sampai tanggal (opsional)</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-2.5">
              <label className="flex-1 flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                <span>Jam mulai</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
                />
              </label>
              <label className="flex-1 flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                <span>Jam selesai</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
                />
              </label>
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm font-medium my-3.5 cursor-pointer">
          <input type="checkbox" className="w-[18px] h-[18px]" checked={hasDeadline} onChange={(e) => setHasDeadline(e.target.checked)} />
          <span>Punya deadline (muncul di tab Tugas)</span>
        </label>

        {hasDeadline && (
          <div className="border-l-2 border-line pl-3 mb-1.5">
            <div className="flex gap-2.5">
              <label className="flex-1 flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                <span>Tanggal deadline</span>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
                />
              </label>
              <label className="flex-1 flex flex-col gap-1.5 text-[13px] text-ink-soft mb-3">
                <span>Jam deadline (opsional)</span>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="text-[14px] text-ink border border-line rounded-lg px-2.5 py-2 bg-bg"
                />
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2.5 mt-4">
          {editing ? (
            <button onClick={handleDelete} className="font-display font-semibold text-sm bg-rust-light text-rust rounded-xl px-4 py-2.5">
              Hapus
            </button>
          ) : <span />}
          <div className="flex gap-2 ml-auto">
            <button onClick={onClose} className="border border-line bg-surface text-ink text-[13px] font-medium px-3 py-1.5 rounded-full hover:border-teal hover:text-teal">
              Batal
            </button>
            <button onClick={handleSave} className="font-display font-semibold text-sm bg-teal text-white rounded-xl px-4 py-2.5">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

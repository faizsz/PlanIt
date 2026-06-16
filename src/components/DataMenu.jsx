import { useState, useRef, useEffect } from 'react'
import { Database, Download, Upload } from 'lucide-react'
import { usePlanner } from '../context/PlannerContext'
import { useUI } from '../context/UIContext'

export default function DataMenu() {
  const { exportData, importData } = usePlanner()
  const { toast, confirm } = useUI()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function handleExport() {
    exportData()
    setOpen(false)
    toast('Backup berhasil diunduh.', { type: 'success' })
  }

  function handlePickFile() {
    fileRef.current?.click()
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // reset so same file can be re-selected
    if (!file) return

    let parsed
    try {
      const text = await file.text()
      parsed = JSON.parse(text)
    } catch {
      toast('Gagal membaca file. Pastikan file JSON valid.', { type: 'error' })
      return
    }

    const replace = await confirm({
      title: 'Import data',
      message:
        'Ganti semua data saat ini dengan isi file backup? Pilih "Batal" jika ingin menggabungkan tanpa menghapus data lama.',
      confirmText: 'Ganti semua',
      cancelText: 'Gabungkan',
    })

    const result = importData(parsed, { merge: !replace })
    if (result.ok) {
      toast(result.message, { type: 'success' })
      setOpen(false)
    } else {
      toast(result.message, { type: 'error' })
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Backup & restore data"
        className="flex items-center justify-center w-11 h-11 rounded-full border border-line bg-surface text-ink-soft hover:text-teal hover:border-teal transition-colors"
      >
        <Database className="w-5 h-5" strokeWidth={1.8} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-surface border border-line rounded-2xl shadow-xl p-1.5 z-50 animate-[pop_0.15s_ease-out]">
          <button
            onClick={handleExport}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm text-ink hover:bg-teal-light hover:text-teal transition-colors"
          >
            <Download className="w-4 h-4 shrink-0" strokeWidth={1.8} />
            Export (unduh backup)
          </button>
          <button
            onClick={handlePickFile}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm text-ink hover:bg-teal-light hover:text-teal transition-colors"
          >
            <Upload className="w-4 h-4 shrink-0" strokeWidth={1.8} />
            Import (muat backup)
          </button>
          <p className="text-[11px] text-ink-soft px-3 py-1.5 leading-snug">
            Pindahkan data antar perangkat / domain lewat file backup.
          </p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

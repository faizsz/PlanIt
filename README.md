# Rencanaku

Aplikasi rencana harian, kalender, dan daftar deadline pribadi. Dibangun dengan React + Vite + Tailwind CSS, data tersimpan di `localStorage` browser (tanpa login, tanpa server).

## Menjalankan secara lokal

Pastikan sudah ada Node.js (versi 18+) terinstal, lalu jalankan:

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan (biasanya `http://localhost:5173`).

## Build untuk produksi

```bash
npm run build
npm run preview
```

Hasil build ada di folder `dist/` — bisa di-hosting di mana saja (Vercel, Netlify, Cloudflare Pages, GitHub Pages, dll), atau dibuka langsung sebagai file statis.

## Fitur

- **Hari ini**: strip 7 hari (Senin–Minggu), checklist tugas harian per tanggal, tombol "Tandai semua selesai" yang masih bisa di-uncheck satu per satu.
- **Kalender**: tampilan bulanan dengan titik warna sesuai kategori tugas tiap hari, klik tanggal untuk lompat ke tampilan harian.
- **Tugas**: daftar tugas berdeadline, dipisah jadi "Lewat deadline" dan "Belum deadline", lengkap dengan tanggal & jam deadline.
- Tambah tugas: jadwal sekali atau berulang (pilih hari + jam), kategori custom, dan/atau deadline terpisah.

## PWA (Progressive Web App)

Project ini sudah dikonfigurasi dengan `vite-plugin-pwa`. Setelah `npm run build` lalu `npm run preview` (atau di-hosting), buka di browser HP dan pilih **"Add to Home Screen" / "Install App"** — aplikasi akan bisa dibuka seperti app biasa, lengkap dengan ikon dan mode offline (cache).

> Catatan: fitur PWA (install & offline) hanya aktif pada build produksi (`npm run build` + `preview`/hosting), bukan saat `npm run dev`.

## Struktur folder

```
src/
  components/   -> komponen UI (Tabs, WeekStrip, TaskRow, CalendarView, dll)
  context/       -> state global (tasks, categories, completions) via Context API
  hooks/         -> hook localStorage
  utils/         -> helper tanggal & logika jadwal/deadline
public/icons/    -> ikon PWA
```

## Mengganti data

Semua data disimpan di localStorage browser dengan key `rk_tasks`, `rk_categories`, `rk_completions`. Hapus key tersebut di DevTools (Application > Local Storage) untuk reset data.

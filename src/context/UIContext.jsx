import { createContext, useContext, useState, useCallback, useRef } from 'react'
import ToastContainer from '../components/ui/Toast'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [confirmState, setConfirmState] = useState(null)
  const resolverRef = useRef(null)

  const toast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type: opts.type || 'info' }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, opts.duration || 3000)
  }, [])

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setConfirmState({
        title: options.title || 'Konfirmasi',
        message: options.message || '',
        confirmText: options.confirmText || 'Ya',
        cancelText: options.cancelText || 'Batal',
        danger: !!options.danger,
      })
    })
  }, [])

  function handleResult(result) {
    if (resolverRef.current) {
      resolverRef.current(result)
      resolverRef.current = null
    }
    setConfirmState(null)
  }

  return (
    <UIContext.Provider value={{ toast, confirm }}>
      {children}
      <ToastContainer toasts={toasts} />
      {confirmState && <ConfirmDialog {...confirmState} onResult={handleResult} />}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}

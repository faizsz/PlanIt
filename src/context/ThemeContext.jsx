import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rk_theme') || 'light'
    }
    return 'light'
  })

  const toggleRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('rk_theme', theme)
  }, [theme])

  const toggleTheme = useCallback((event) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // Get click coordinates for the circular reveal
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2

    // Calculate the max radius needed to cover the entire screen
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Use View Transition API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(newTheme)
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      })

      // Apply the circular clip-path animation via CSS custom properties
      document.documentElement.style.setProperty('--reveal-x', `${x}px`)
      document.documentElement.style.setProperty('--reveal-y', `${y}px`)
      document.documentElement.style.setProperty('--reveal-radius', `${maxRadius}px`)
    } else {
      // Fallback: just toggle immediately
      setTheme(newTheme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, toggleRef }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

"use client"

import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    toggleTheme(e.nativeEvent)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={cn(
        "relative flex items-center w-[72px] h-11 rounded-full transition-colors duration-300 border",
        isDark
          ? "bg-zinc-900 border-zinc-700"
          : "bg-white border-zinc-200 shadow-sm",
        className
      )}
    >
      {/* static icons */}
      <span className="absolute left-2.5 flex items-center justify-center">
        <Moon
          className="w-[18px] h-[18px] text-zinc-400"
          strokeWidth={1.5}
        />
      </span>
      <span className="absolute right-2.5 flex items-center justify-center">
        <Sun
          className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-500" : "text-zinc-400")}
          strokeWidth={1.5}
        />
      </span>

      {/* sliding knob */}
      <span
        className={cn(
          "absolute top-1 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 shadow",
          isDark
            ? "left-1 translate-x-0 bg-zinc-700"
            : "left-1 translate-x-[31px] bg-zinc-100"
        )}
      >
        {isDark ? (
          <Moon className="w-[18px] h-[18px] text-white" strokeWidth={1.5} />
        ) : (
          <Sun className="w-[18px] h-[18px] text-blue-500" strokeWidth={1.5} />
        )}
      </span>
    </button>
  )
}

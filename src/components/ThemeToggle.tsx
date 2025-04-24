"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "../hooks/useTheme"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  // Show a simplified toggle during SSR
  if (!isClient) {
    return (
      <button
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        aria-label="Toggle theme"
      >
        <Sun size={20} />
      </button>
    )
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun size={20} />}
      {theme === "dark" && <Moon size={20} />}
      {theme === "system" && <Monitor size={20} />}
    </button>
  )
}

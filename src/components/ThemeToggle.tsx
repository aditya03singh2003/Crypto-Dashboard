"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Moon, Sun } from "lucide-react"
import { setTheme } from "../features/crypto/cryptoSlice"
import { selectTheme } from "../features/crypto/cryptoSelectors"

export function ThemeToggle() {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)

  // Update the theme when it changes in Redux
  useEffect(() => {
    const root = window.document.documentElement

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      if (systemTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } else if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = (e: MediaQueryListEvent) => {
        const root = window.document.documentElement
        if (e.matches) {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  const toggleTheme = () => {
    if (theme === "light") {
      dispatch(setTheme("dark"))
    } else if (theme === "dark") {
      dispatch(setTheme("system"))
    } else {
      dispatch(setTheme("light"))
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      title={`Current theme: ${theme}`}
    >
      {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}

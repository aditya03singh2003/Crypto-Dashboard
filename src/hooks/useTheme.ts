"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light") // Default to light for SSR
  const [isClient, setIsClient] = useState(false)

  // Initialize theme on client-side only
  useEffect(() => {
    setIsClient(true)

    // Check localStorage first
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null

      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // If no theme in localStorage, check system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setTheme("dark")
        } else {
          setTheme("light")
        }
      }
    }
  }, [])

  // Apply theme effect
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const root = window.document.documentElement

    // Remove both classes first
    root.classList.remove("light", "dark")

    // Apply the appropriate class based on theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      localStorage.removeItem("theme") // Remove from localStorage to follow system
    } else {
      root.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme, isClient])

  // Listen for system theme changes
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, isClient])

  return { theme, setTheme }
}

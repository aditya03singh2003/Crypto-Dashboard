"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "../app/store"
import { useEffect, useState } from "react"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // This ensures the component only renders on the client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return null during SSR to avoid hydration mismatch
    return null
  }

  return <Provider store={store}>{children}</Provider>
}

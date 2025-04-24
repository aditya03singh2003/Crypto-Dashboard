"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "../app/store"
import { useEffect, useState } from "react"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // This ensures the component only renders on the client
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // Return a placeholder or loading state during SSR
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900"></div>
  }

  return <Provider store={store}>{children}</Provider>
}

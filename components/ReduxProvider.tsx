"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { useEffect, useState } from "react"
import { webSocketSimulator } from "@/lib/WebSocketSimulator"
import { binanceWebSocket } from "@/lib/BinanceWebSocket"
import { selectIsLiveUpdatesEnabled } from "@/lib/cryptoSlice"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [useFallback, setUseFallback] = useState(false)

  // Start the WebSocket connection when the component mounts
  useEffect(() => {
    // Try to connect to Binance WebSocket first
    try {
      binanceWebSocket.connect()

      // Set a timeout to check if Binance WebSocket is working
      const timeoutId = setTimeout(() => {
        // If we haven't received any data after 10 seconds, fall back to simulator
        setUseFallback(true)
        binanceWebSocket.disconnect()
        webSocketSimulator.start()
      }, 10000)

      return () => {
        clearTimeout(timeoutId)
        binanceWebSocket.disconnect()
        webSocketSimulator.stop()
      }
    } catch (error) {
      console.error("Failed to connect to Binance WebSocket:", error)
      setUseFallback(true)
      webSocketSimulator.start()

      return () => {
        webSocketSimulator.stop()
      }
    }
  }, [])

  // Monitor live updates setting
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const isLiveUpdatesEnabled = selectIsLiveUpdatesEnabled(store.getState())

      if (isLiveUpdatesEnabled) {
        if (useFallback) {
          webSocketSimulator.start()
        } else {
          binanceWebSocket.connect()
        }
      } else {
        if (useFallback) {
          webSocketSimulator.stop()
        } else {
          binanceWebSocket.disconnect()
        }
      }
    })

    return unsubscribe
  }, [useFallback])

  return <Provider store={store}>{children}</Provider>
}

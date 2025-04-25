"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { startWebSocketConnection, stopWebSocketConnection } from "../features/crypto/cryptoSlice"
import { selectWebSocketActive } from "../features/crypto/cryptoSelectors"
import { fallbackService } from "../services/fallbackService"

const LiveUpdatesToggle = () => {
  const dispatch = useDispatch()
  const webSocketActive = useSelector(selectWebSocketActive)
  const [isLiveUpdates, setIsLiveUpdates] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (isLiveUpdates) {
      try {
        dispatch(startWebSocketConnection())

        // Set a timeout to check if WebSocket is working
        const timeoutId = setTimeout(() => {
          // If we haven't received any data after 10 seconds, fall back to simulation
          if (!webSocketActive) {
            console.log("WebSocket connection failed, falling back to simulation")
            fallbackService.start()
          }
        }, 10000)

        return () => {
          clearTimeout(timeoutId)
          if (webSocketActive) {
            dispatch(stopWebSocketConnection())
          } else {
            fallbackService.stop()
          }
        }
      } catch (error) {
        console.error("Failed to start WebSocket connection:", error)
        fallbackService.start()

        return () => {
          fallbackService.stop()
        }
      }
    } else {
      // Stop all data sources when live updates are disabled
      if (webSocketActive) {
        dispatch(stopWebSocketConnection())
      } else {
        fallbackService.stop()
      }
    }
  }, [dispatch, webSocketActive, isLiveUpdates, mounted])

  const toggleLiveUpdates = () => {
    setIsLiveUpdates(!isLiveUpdates)
  }

  if (!mounted) return null

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={toggleLiveUpdates}
        className={`px-6 py-2 rounded-lg ${isLiveUpdates ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
      >
        Live Updates: {isLiveUpdates ? "ON" : "OFF"}
      </button>
    </div>
  )
}

export default LiveUpdatesToggle

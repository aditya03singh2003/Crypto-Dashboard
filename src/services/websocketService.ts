import { store } from "../app/store"
import { updateCryptoData, setError } from "../features/crypto/cryptoSlice"
import { WebSocketSimulator } from "../WebSocketSimulator"
import { initialCryptoData } from "../data/initialCryptoData"
import type { WebSocketOptions } from "../types"

class WebSocketService {
  private ws: WebSocketSimulator | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: number | null = null

  connect(options: WebSocketOptions = {}) {
    console.log("Connecting to WebSocket...", options)

    // Create a new WebSocket simulator with initial data and options
    this.ws = new WebSocketSimulator(initialCryptoData, options)

    // Add event listeners
    this.ws.addEventListener("open", this.handleOpen)
    this.ws.addEventListener("message", this.handleMessage)
    this.ws.addEventListener("close", this.handleClose)
    this.ws.addEventListener("error", this.handleError)

    // Connect to the WebSocket
    this.ws.connect()
  }

  disconnect() {
    if (this.ws) {
      this.ws.removeEventListener("open", this.handleOpen)
      this.ws.removeEventListener("message", this.handleMessage)
      this.ws.removeEventListener("close", this.handleClose)
      this.ws.removeEventListener("error", this.handleError)
      this.ws.disconnect()
      this.ws = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    this.reconnectAttempts = 0
  }

  private handleOpen = () => {
    console.log("WebSocket connection opened")
    this.reconnectAttempts = 0
  }

  private handleMessage = (data: any) => {
    // Update the Redux store with the new data
    store.dispatch(updateCryptoData(data))
  }

  private handleClose = () => {
    console.log("WebSocket connection closed")

    // Try to reconnect if we haven't exceeded the maximum number of attempts
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++

      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

      this.reconnectTimeout = window.setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.error("Maximum reconnect attempts reached. Giving up.")
    }
  }

  private handleError = (error: any) => {
    console.error("WebSocket error:", error)
    store.dispatch(setError(error instanceof Error ? error.message : "WebSocket error"))
  }
}

export const websocketService = new WebSocketService()

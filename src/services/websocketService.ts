import { store } from "../app/store"
import { updateCryptoData } from "../features/crypto/cryptoSlice"
import type { Crypto } from "../types"
import { WEBSOCKET_CONFIG } from "../config"

class WebSocketService {
  private socket: WebSocket | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private lastPrices: Record<string, number> = {}

  connect(): void {
    if (this.socket) {
      this.disconnect()
    }

    try {
      // Connect to Binance WebSocket API for multiple streams
      const streams = WEBSOCKET_CONFIG.SUPPORTED_PAIRS.map((symbol) => `${symbol}@ticker`).join("/")
      this.socket = new WebSocket(`${WEBSOCKET_CONFIG.BASE_URL}/${streams}`)

      this.socket.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0 // Reset reconnect attempts on successful connection
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handleTickerUpdate(data)
      }

      this.socket.onclose = () => {
        console.log("WebSocket disconnected")
        this.reconnect()
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.socket?.close()
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      this.reconnect()
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  private reconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectAttempts++

    if (this.reconnectAttempts <= WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.log(`Reconnect attempt ${this.reconnectAttempts} of ${WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS}`)

      this.reconnectTimeout = setTimeout(() => {
        console.log("Attempting to reconnect...")
        this.connect()
      }, WEBSOCKET_CONFIG.RECONNECT_INTERVAL)
    } else {
      console.error("Max reconnect attempts reached. Giving up.")
      // Could dispatch an action here to show an error to the user
    }
  }

  private handleTickerUpdate(data: any): void {
    // Extract the symbol from the stream name
    const symbol = data.s?.toLowerCase() || ""

    if (!symbol) return

    // Get current state
    const { cryptos } = store.getState().crypto

    // Find the corresponding crypto in our state
    const cryptoId = WEBSOCKET_CONFIG.SYMBOL_MAP[symbol]
    if (!cryptoId) return

    const cryptoIndex = cryptos.findIndex((c) => c.id === cryptoId)
    if (cryptoIndex === -1) return

    const crypto = cryptos[cryptoIndex]

    // Calculate percentage changes
    const currentPrice = Number.parseFloat(data.c)
    const prevPrice = this.lastPrices[symbol] || currentPrice
    const priceChange = currentPrice - prevPrice
    const percentChange = prevPrice ? (priceChange / prevPrice) * 100 : 0

    // Update last price
    this.lastPrices[symbol] = currentPrice

    // Create updated crypto object
    const updatedCrypto: Crypto = {
      ...crypto,
      price: currentPrice,
      change1h: Number.parseFloat(data.P) / 24, // Approximate 1h change from 24h change
      change24h: Number.parseFloat(data.P), // 24h price change percent
      change7d: crypto.change7d + percentChange * 0.05, // Simulate 7d change
      volume24h: Number.parseFloat(data.q), // 24h volume
      volumeInCrypto: Number.parseFloat(data.q) / currentPrice,
      marketCap: crypto.circulatingSupply * currentPrice,
    }

    // Update sparkline data
    const newSparkline = [...crypto.sparkline7d.slice(1), currentPrice]
    updatedCrypto.sparkline7d = newSparkline

    // Create a new array with the updated crypto
    const updatedCryptos = [...cryptos]
    updatedCryptos[cryptoIndex] = updatedCrypto

    // Dispatch update action
    store.dispatch(updateCryptoData(updatedCryptos))
  }
}

export const websocketService = new WebSocketService()

import { store } from "@/lib/store"
import { updateCryptoData } from "@/lib/cryptoSlice"

// Define the structure of Binance WebSocket ticker data
interface BinanceTickerData {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  p: string // Price change
  P: string // Price change percent
  w: string // Weighted average price
  c: string // Last price
  Q: string // Last quantity
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
  O: number // Statistics open time
  C: number // Statistics close time
  F: number // First trade ID
  L: number // Last trade ID
  n: number // Total number of trades
}

// Map Binance symbols to our cryptocurrency IDs
const symbolToCryptoId: Record<string, number> = {
  BTCUSDT: 1, // Bitcoin
  ETHUSDT: 2, // Ethereum
  XRPUSDT: 5, // XRP
  BNBUSDT: 4, // BNB
  ADAUSDT: 6, // Cardano
  SOLUSDT: 10, // Solana
  DOGEUSDT: 7, // Dogecoin
  DOTUSDT: 8, // Polkadot
  SHIBUSDT: 9, // Shiba Inu
  MATICUSDT: 12, // Polygon
}

class BinanceWebSocket {
  private socket: WebSocket | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private readonly MAX_RECONNECT_ATTEMPTS = 5
  private readonly RECONNECT_INTERVAL = 5000 // 5 seconds

  connect(): void {
    if (this.socket) {
      this.disconnect()
    }

    try {
      // Create a list of symbols to subscribe to
      const symbols = Object.keys(symbolToCryptoId).map((symbol) => symbol.toLowerCase())

      // Connect to Binance WebSocket API for multiple streams
      const streams = symbols.map((symbol) => `${symbol}@ticker`).join("/")
      this.socket = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`)

      this.socket.onopen = () => {
        console.log("Binance WebSocket connected")
        this.reconnectAttempts = 0 // Reset reconnect attempts on successful connection
      }

      this.socket.onmessage = (event) => {
        try {
          const data: BinanceTickerData = JSON.parse(event.data)
          this.handleTickerUpdate(data)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.socket.onclose = () => {
        console.log("Binance WebSocket disconnected")
        this.reconnect()
      }

      this.socket.onerror = (error) => {
        console.error("Binance WebSocket error:", error)
        this.socket?.close()
      }
    } catch (error) {
      console.error("Failed to connect to Binance WebSocket:", error)
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

    if (this.reconnectAttempts <= this.MAX_RECONNECT_ATTEMPTS) {
      console.log(`Reconnect attempt ${this.reconnectAttempts} of ${this.MAX_RECONNECT_ATTEMPTS}`)

      this.reconnectTimeout = setTimeout(() => {
        console.log("Attempting to reconnect to Binance...")
        this.connect()
      }, this.RECONNECT_INTERVAL)
    } else {
      console.error("Max reconnect attempts reached. Falling back to simulator.")
      // Fall back to the simulator
      import("./WebSocketSimulator").then(({ webSocketSimulator }) => {
        webSocketSimulator.start()
      })
    }
  }

  private handleTickerUpdate(data: BinanceTickerData): void {
    // Get the cryptocurrency ID from the symbol
    const cryptoId = symbolToCryptoId[data.s]
    if (!cryptoId) return

    // Get current state
    const { cryptocurrencies } = store.getState().crypto

    // Find the cryptocurrency in our state
    const cryptoIndex = cryptocurrencies.findIndex((c) => c.id === cryptoId)
    if (cryptoIndex === -1) return

    const crypto = cryptocurrencies[cryptoIndex]

    // Parse the data from Binance
    const price = Number.parseFloat(data.c)
    const change24h = Number.parseFloat(data.P)
    const volume24h = Number.parseFloat(data.q)

    // Create updated cryptocurrency object
    const updatedCrypto = {
      ...crypto,
      price,
      change24h,
      volume24h,
      // Update price history
      priceHistory: [...crypto.priceHistory.slice(1), price],
      // Recalculate market cap
      marketCap: crypto.circulatingSupply * price,
    }

    // Create a new array with the updated cryptocurrency
    const updatedCryptos = [...cryptocurrencies]
    updatedCryptos[cryptoIndex] = updatedCrypto

    // Dispatch update action
    store.dispatch(updateCryptoData(updatedCryptos))
  }
}

export const binanceWebSocket = new BinanceWebSocket()

import { store } from "@/lib/store"
import { updateCryptoData } from "@/lib/cryptoSlice"
import { cryptocurrencies } from "@/lib/mockData"

class WebSocketSimulator {
  private intervalId: NodeJS.Timeout | null = null
  private isActive = false

  start(): void {
    if (this.isActive) return

    this.isActive = true
    console.log("WebSocket simulator started")

    // Update data every 1-2 seconds
    this.intervalId = setInterval(
      () => {
        this.simulateDataUpdate()
      },
      1000 + Math.random() * 1000,
    )
  }

  stop(): void {
    if (!this.isActive) return

    this.isActive = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    console.log("WebSocket simulator stopped")
  }

  private simulateDataUpdate(): void {
    // Get current cryptocurrencies from the store
    const updatedCryptos = [...cryptocurrencies].map((crypto) => {
      // Generate random price changes (between -1% and +1%)
      const priceChange = (Math.random() * 2 - 1) * 0.01
      const newPrice = crypto.price * (1 + priceChange)

      // Generate random percentage changes
      const new24hChange = crypto.change24h + (Math.random() * 0.4 - 0.2) // -0.2% to +0.2%
      const new7dChange = crypto.change7d + (Math.random() * 0.4 - 0.2)

      // Generate random volume changes (between -2% and +2%)
      const volumeChange = (Math.random() * 4 - 2) * 0.01
      const newVolume = crypto.volume24h * (1 + volumeChange)

      // Update price history
      const newPriceHistory = [...crypto.priceHistory.slice(1), newPrice]

      return {
        ...crypto,
        price: newPrice,
        change24h: new24hChange,
        change7d: new7dChange,
        volume24h: newVolume,
        priceHistory: newPriceHistory,
      }
    })

    // Dispatch the update action to Redux
    store.dispatch(updateCryptoData(updatedCryptos))
  }
}

export const webSocketSimulator = new WebSocketSimulator()

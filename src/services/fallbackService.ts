import { store } from "../app/store"
import { updateCryptoData } from "../features/crypto/cryptoSlice"

class FallbackService {
  private intervalId: number | null = null

  start(): void {
    if (this.intervalId) {
      this.stop()
    }

    // Simulate WebSocket updates every 1.5 seconds
    this.intervalId = window.setInterval(() => {
      this.simulateUpdate()
    }, 1500)

    console.log("Fallback service started")
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log("Fallback service stopped")
    }
  }

  private simulateUpdate(): void {
    // Get current state
    const { cryptos } = store.getState().crypto

    // Generate random updates for each crypto
    const updatedCryptos = cryptos.map((crypto) => {
      // Generate random price changes
      const priceChange = (Math.random() * 2 - 1) * 0.01 // -1% to +1%
      const newPrice = crypto.price * (1 + priceChange)

      // Generate random percentage changes
      const new1hChange = crypto.change1h + (Math.random() * 0.4 - 0.2) // -0.2% to +0.2%
      const new24hChange = crypto.change24h + (Math.random() * 0.4 - 0.2)
      const new7dChange = crypto.change7d + (Math.random() * 0.4 - 0.2)

      // Generate random volume changes
      const volumeChange = Math.random() * 0.04 - 0.02 // -2% to +2%
      const newVolume = crypto.volume24h * (1 + volumeChange)
      const newVolumeInCrypto = newVolume / newPrice

      // Calculate new market cap based on new price
      const newMarketCap = crypto.circulatingSupply * newPrice

      // Update sparkline data by removing the first point and adding a new one
      const newSparkline = [...crypto.sparkline7d.slice(1), newPrice]

      return {
        ...crypto,
        price: newPrice,
        change1h: new1hChange,
        change24h: new24hChange,
        change7d: new7dChange,
        volume24h: newVolume,
        volumeInCrypto: newVolumeInCrypto,
        marketCap: newMarketCap,
        sparkline7d: newSparkline,
      }
    })

    // Dispatch update action
    store.dispatch(updateCryptoData(updatedCryptos))
  }
}

export const fallbackService = new FallbackService()

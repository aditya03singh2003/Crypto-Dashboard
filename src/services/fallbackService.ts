import { store } from "../app/store"
import { updateCryptoData } from "../features/crypto/cryptoSlice"
import { initialCryptoData } from "../data/initialCryptoData"
import type { Crypto } from "../types"

class FallbackService {
  private intervalId: number | null = null
  private cryptoData: Crypto[] = []

  start() {
    console.log("Starting fallback service...")

    // Initialize with the initial data
    this.cryptoData = [...initialCryptoData]

    // Update the data every 1-2 seconds
    this.intervalId = window.setInterval(
      () => {
        this.updateData()
      },
      1000 + Math.random() * 1000,
    )
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    console.log("Fallback service stopped")
  }

  private updateData() {
    const updatedData = this.cryptoData.map((crypto) => {
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
      const newVolumeInCrypto = crypto.volumeInCrypto * (1 + volumeChange)

      // Update sparkline data
      const newSparkline = [...crypto.sparkline7d.slice(1), newPrice]

      return {
        ...crypto,
        price: newPrice,
        change1h: new1hChange,
        change24h: new24hChange,
        change7d: new7dChange,
        volume24h: newVolume,
        volumeInCrypto: newVolumeInCrypto,
        sparkline7d: newSparkline,
      }
    })

    // Update the Redux store
    store.dispatch(updateCryptoData(updatedData))

    // Update our local copy
    this.cryptoData = updatedData
  }
}

export const fallbackService = new FallbackService()

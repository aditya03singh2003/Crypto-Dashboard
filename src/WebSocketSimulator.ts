// Enhanced WebSocket simulator with more configuration options
export class WebSocketSimulator {
  private callbacks: { [event: string]: ((data: any) => void)[] } = {}
  private intervalId: number | null = null
  private cryptoData: any[] = []
  private updateFrequency: number
  private volatility: number

  constructor(
    cryptoData: any[],
    options: {
      updateFrequency?: number // milliseconds
      volatility?: number // 0-1 scale
    } = {},
  ) {
    this.cryptoData = [...cryptoData]
    this.updateFrequency = options.updateFrequency || 2000 // Default 2 seconds
    this.volatility = options.volatility || 0.01 // Default 1% max change
  }

  // Connect to the "WebSocket"
  connect(): void {
    console.log("WebSocket simulator connected")

    // Simulate receiving data at the configured frequency
    this.intervalId = window.setInterval(() => {
      const updatedData = this.generateUpdatedData()
      this.triggerEvent("message", updatedData)
    }, this.updateFrequency)

    // Trigger the open event
    setTimeout(() => {
      this.triggerEvent("open", {})
    }, 100)
  }

  // Disconnect from the "WebSocket"
  disconnect(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    console.log("WebSocket simulator disconnected")
    this.triggerEvent("close", {})
  }

  // Add an event listener
  addEventListener(event: string, callback: (data: any) => void): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  // Remove an event listener
  removeEventListener(event: string, callback: (data: any) => void): void {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback)
    }
  }

  // Trigger an event
  private triggerEvent(event: string, data: any): void {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => callback(data))
    }
  }

  // Generate updated data with configurable volatility
  private generateUpdatedData(): any {
    return this.cryptoData.map((crypto) => {
      // Generate random price changes based on volatility setting
      const priceChange = (Math.random() * 2 - 1) * this.volatility
      const newPrice = crypto.price * (1 + priceChange)

      // Generate random percentage changes
      const new1hChange = crypto.change1h + (Math.random() * this.volatility * 20 - this.volatility * 10)
      const new24hChange = crypto.change24h + (Math.random() * this.volatility * 20 - this.volatility * 10)
      const new7dChange = crypto.change7d + (Math.random() * this.volatility * 20 - this.volatility * 10)

      // Generate random volume changes
      const volumeChange = Math.random() * this.volatility * 4 - this.volatility * 2
      const newVolume = crypto.volume24h * (1 + volumeChange)

      // Update sparkline data with more randomness
      const newSparkline = [...crypto.sparkline7d.slice(1)]

      // Add a new point with configurable randomness
      const lastPrice = crypto.sparkline7d[crypto.sparkline7d.length - 1]
      const randomFactor = Math.random() * this.volatility * 3 - this.volatility * 1.5
      const newPoint = lastPrice * (1 + randomFactor)
      newSparkline.push(newPoint)

      return {
        ...crypto,
        price: newPrice,
        change1h: new1hChange,
        change24h: new24hChange,
        change7d: new7dChange,
        volume24h: newVolume,
        volumeInCrypto: crypto.volumeInCrypto * (1 + volumeChange),
        sparkline7d: newSparkline,
      }
    })
  }
}

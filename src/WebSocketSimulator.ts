// This is a mock WebSocket class that simulates real-time data updates
export class WebSocketSimulator {
  private callbacks: { [event: string]: ((data: any) => void)[] } = {}
  private intervalId: number | null = null
  private cryptoData: any[] = []

  constructor(cryptoData: any[]) {
    this.cryptoData = [...cryptoData]
  }

  // Connect to the "WebSocket"
  connect(): void {
    console.log("WebSocket simulator connected")

    // Simulate receiving data every 1-2 seconds
    this.intervalId = window.setInterval(
      () => {
        const updatedData = this.generateUpdatedData()
        this.triggerEvent("message", updatedData)
      },
      1000 + Math.random() * 1000,
    )

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

  // Generate updated data
  private generateUpdatedData(): any {
    return this.cryptoData.map((crypto) => {
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

      return {
        ...crypto,
        price: newPrice,
        change1h: new1hChange,
        change24h: new24hChange,
        change7d: new7dChange,
        volume24h: newVolume,
      }
    })
  }
}

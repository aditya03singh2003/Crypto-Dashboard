// Export the websocket configuration as a named export
export const WEBSOCKET_CONFIG = {
  // Base URL for Binance WebSocket API
  BASE_URL: "wss://stream.binance.com:9443/ws",

  // Reconnection settings
  RECONNECT_INTERVAL: 5000, // 5 seconds
  MAX_RECONNECT_ATTEMPTS: 5,

  // Supported cryptocurrency pairs
  SUPPORTED_PAIRS: [
    "btcusdt", // Bitcoin
    "ethusdt", // Ethereum
    "xrpusdt", // XRP
    "bnbusdt", // BNB
    "adausdt", // Cardano
    "solusdt", // Solana
    "dogeusdt", // Dogecoin
    "dotusdt", // Polkadot
    "maticusdt", // Polygon
    "ltcusdt", // Litecoin
  ],

  // Mapping from Binance symbols to our internal IDs
  SYMBOL_MAP: {
    btcusdt: "bitcoin",
    ethusdt: "ethereum",
    xrpusdt: "ripple",
    bnbusdt: "bnb",
    adausdt: "cardano",
    solusdt: "solana",
    dogeusdt: "dogecoin",
    dotusdt: "polkadot",
    maticusdt: "polygon",
    ltcusdt: "litecoin",
  },
}

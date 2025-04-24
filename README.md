# Crypto Tracker

A responsive React + Redux Toolkit application that tracks real-time cryptocurrency prices using WebSocket connections to Binance API and manages all state via Redux.

## Features

- 📊 Responsive UI table displaying cryptocurrency data
- 🔄 Real-time price updates via Binance WebSocket API
- 🧠 Complete Redux state management using Redux Toolkit
- 🌙 Dark mode support with theme persistence
- 📱 Mobile-friendly design
- 📊 Color-coded percentage changes
- 📈 7-day price charts
- 🔍 Advanced filtering and sorting functionality
- ⭐ Favorites system with localStorage persistence
- 🧪 Unit tests for reducers and selectors

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- React Router
- TailwindCSS
- Recharts (for charts)
- Lucide React (for icons)
- Jest (for testing)

## Implementation Details

### Redux State Management

The application uses Redux Toolkit for state management with:
- `createSlice` for defining reducers and actions
- `configureStore` for setting up the Redux store
- Selectors for optimized rendering
- Thunks for asynchronous operations

### Real-time Data with WebSockets

The application connects to Binance WebSocket API to receive real-time cryptocurrency data:
- Establishes WebSocket connections for multiple cryptocurrency pairs
- Handles connection errors and automatic reconnection
- Updates Redux store with the latest price data
- Calculates percentage changes and other derived values

### Persistence with localStorage

User preferences and application state are persisted using localStorage:
- Theme preference (light/dark mode)
- Sorting preferences
- Filter settings
- Favorite cryptocurrencies

### Responsive Design

The UI is fully responsive and works on:
- Desktop
- Tablet
- Mobile devices

## Getting Started

1. Clone the repository
   \`\`\`
   git clone https://github.com/yourusername/crypto-tracker.git
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`
   npm start
   \`\`\`

4. Run tests:
   \`\`\`
   npm test
   \`\`\`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

\`\`\`
src/
├── app/              # Redux store configuration
├── components/       # React components
├── data/             # Initial data and constants
├── features/         # Redux slices and selectors
│   └── crypto/       # Cryptocurrency feature
│       ├── __tests__/  # Unit tests
│       ├── cryptoSelectors.ts
│       └── cryptoSlice.ts
├── pages/            # Page components
├── services/         # API and WebSocket services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
\`\`\`

## Future Improvements

- Add more cryptocurrency pairs
- Implement price alerts
- Add historical data charts
- Support for multiple fiat currencies
- Portfolio tracking with performance metrics
- News feed integration
- Mobile app with React Native

## License

MIT
\`\`\`

Let's create a custom hook for theme management to improve the theme toggle functionality:

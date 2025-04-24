import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./app/store"

// Initialize dark mode based on user preference or localStorage only on the client side
if (typeof window !== "undefined") {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

// Only run this code on the client side
if (typeof window !== "undefined") {
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

// Export a default function for server-side rendering
export default function Index() {
  return null
}

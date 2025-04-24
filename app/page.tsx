import Sidebar from "@/components/Sidebar"
import BentoGrid from "@/components/BentoGrid"
import CryptocurrencyTable from "@/components/CryptocurrencyTable"
import MarketOverviewBanner from "@/components/MarketOverviewBanner"
import NewsFeed from "@/components/NewsFeed"
import MarketSentiment from "@/components/MarketSentiment"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <MarketOverviewBanner liveUpdates={true} />
        <BentoGrid />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CryptocurrencyTable />
          </div>
          <div className="space-y-6">
            <MarketSentiment />
            <NewsFeed />
          </div>
        </div>
      </main>
    </div>
  )
}

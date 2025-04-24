"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, ExternalLink } from "lucide-react"

const newsArticles = [
  {
    id: 1,
    title: "Bitcoin Surges Past $90,000 as Institutional Interest Grows",
    summary:
      "Bitcoin has reached a new all-time high above $90,000 as institutional investors continue to pour money into the cryptocurrency market. Analysts attribute the surge to growing acceptance among traditional financial institutions.",
    source: "CryptoNews",
    url: "#",
    date: "2025-04-23",
    image: "https://via.placeholder.com/300x200?text=Bitcoin+Surge",
    category: "Markets",
  },
  {
    id: 2,
    title: "Ethereum 2.0 Upgrade: What You Need to Know",
    summary:
      "The long-awaited Ethereum 2.0 upgrade is set to roll out next month, promising improved scalability, security, and sustainability. Here's what users and investors should expect from the transition.",
    source: "BlockchainInsider",
    url: "#",
    date: "2025-04-22",
    image: "https://via.placeholder.com/300x200?text=Ethereum+2.0",
    category: "Technology",
  },
  {
    id: 3,
    title: "Regulatory Challenges Facing Cryptocurrency Exchanges",
    summary:
      "Cryptocurrency exchanges worldwide are facing increasing regulatory scrutiny as governments seek to establish clearer frameworks for digital assets. This article examines the key challenges and potential impacts on the market.",
    source: "CoinDesk",
    url: "#",
    date: "2025-04-21",
    image: "https://via.placeholder.com/300x200?text=Crypto+Regulation",
    category: "Regulation",
  },
  {
    id: 4,
    title: "DeFi Protocols See Record Growth in Total Value Locked",
    summary:
      "Decentralized finance (DeFi) protocols have reached a new milestone with over $500 billion in total value locked. This growth reflects increasing confidence in DeFi applications and their potential to disrupt traditional finance.",
    source: "DeFiPulse",
    url: "#",
    date: "2025-04-20",
    image: "https://via.placeholder.com/300x200?text=DeFi+Growth",
    category: "DeFi",
  },
  {
    id: 5,
    title: "NFT Market Rebounds: Blue-Chip Collections Lead the Way",
    summary:
      "After months of declining sales, the NFT market is showing signs of recovery, with blue-chip collections like Bored Ape Yacht Club and CryptoPunks leading the resurgence. Experts suggest this could signal a more mature phase for NFTs.",
    source: "NFTWorld",
    url: "#",
    date: "2025-04-19",
    image: "https://via.placeholder.com/300x200?text=NFT+Market",
    category: "NFTs",
  },
  {
    id: 6,
    title: "Central Banks Accelerate CBDC Development Worldwide",
    summary:
      "Central banks around the world are ramping up their efforts to develop Central Bank Digital Currencies (CBDCs). This comprehensive report examines the progress in different countries and potential implications for the global financial system.",
    source: "FinancialTimes",
    url: "#",
    date: "2025-04-18",
    image: "https://via.placeholder.com/300x200?text=CBDC+Development",
    category: "CBDCs",
  },
]

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = ["All", "Markets", "Technology", "Regulation", "DeFi", "NFTs", "CBDCs"]

  const filteredArticles = newsArticles.filter(
    (article) =>
      (selectedCategory === "All" || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading News...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cryptocurrency News</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {article.category}
                </span>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  {article.date}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{article.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{article.source}</span>
                <a
                  href={article.url}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read more <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">No news articles found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default NewsPage

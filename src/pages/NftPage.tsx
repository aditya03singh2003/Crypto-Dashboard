"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"

const nftCollections = [
  {
    id: 1,
    name: "Bored Ape Yacht Club",
    image:
      "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=256",
    floorPrice: 18.5,
    volume24h: 1234.56,
    owners: 6450,
    items: 10000,
  },
  {
    id: 2,
    name: "CryptoPunks",
    image:
      "https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&dpr=1&w=256",
    floorPrice: 63.95,
    volume24h: 987.32,
    owners: 3500,
    items: 10000,
  },
  {
    id: 3,
    name: "Azuki",
    image:
      "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=256",
    floorPrice: 10.88,
    volume24h: 567.89,
    owners: 5200,
    items: 10000,
  },
  {
    id: 4,
    name: "Doodles",
    image:
      "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=256",
    floorPrice: 2.69,
    volume24h: 345.67,
    owners: 4800,
    items: 10000,
  },
  {
    id: 5,
    name: "Moonbirds",
    image:
      "https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&dpr=1&w=256",
    floorPrice: 3.98,
    volume24h: 234.56,
    owners: 6300,
    items: 10000,
  },
  {
    id: 6,
    name: "World of Women",
    image:
      "https://i.seadn.io/gae/EFAQpIktMraCnUfW8gYQEUKO8J2klTFE4ttGRGi5n8CgKUDyMIHAaF9PjESWjbQKoI9fbLTC9yDQOp2vCUy_PfIWcVJwbiCPZb60?auto=format&dpr=1&w=256",
    floorPrice: 1.03,
    volume24h: 123.45,
    owners: 3900,
    items: 10000,
  },
]

const NftPage = () => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredCollections = nftCollections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Show a loading state during SSR or if client-side rendering hasn't completed
  if (!isClient || typeof window === "undefined") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading NFT Collections...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">NFT Collections</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Explore top NFT collections by volume, floor price, and more. Discover digital art, collectibles, and other
          blockchain-based assets.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <button className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <div key={collection.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{collection.name}</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Floor Price</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{collection.floorPrice} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{collection.volume24h} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Owners</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{collection.owners}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{collection.items}</p>
                </div>
              </div>

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Collection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NftPage

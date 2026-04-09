import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchFavorites, removeFavorite } from '../services/api'
import PlaceCard from '../components/PlaceCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchFavorites()
      setFavorites(data)
    } catch (err) {
      setError('Could not load favorites. Is the server running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const handleRemove = useCallback(async (placeId) => {
    // Optimistic remove
    setFavorites((prev) => prev.filter((f) => f.place_id !== placeId))
    try {
      await removeFavorite(placeId)
    } catch {
      // Re-fetch on failure to restore accurate state
      loadFavorites()
    }
  }, [loadFavorites])

  const favoritedIds = new Set(favorites.map((f) => f.place_id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={20} className="fill-red-500 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">Saved Places</h1>
        </div>
        <p className="text-sm text-gray-500">Your hand-picked spots for work and study.</p>
      </div>

      {loading && <LoadingSpinner message="Loading your favorites…" />}

      {error && (
        <EmptyState
          title="Couldn't load favorites"
          subtitle={error}
          action={loadFavorites}
          actionLabel="Try again"
        />
      )}

      {!loading && !error && favorites.length === 0 && (
        <EmptyState
          title="No saved places yet"
          subtitle="Tap the heart on any place to save it here for quick access."
          action={undefined}
        >
          <Link
            to="/"
            className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:text-brand-800 underline underline-offset-2 transition"
          >
            Explore places →
          </Link>
        </EmptyState>
      )}

      {!loading && !error && favorites.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-5">
            {favorites.length} saved place{favorites.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((fav) => (
              <PlaceCard
                key={fav.id}
                place={fav.place}
                isFavorited={favoritedIds.has(fav.place_id)}
                onToggleFavorite={handleRemove}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

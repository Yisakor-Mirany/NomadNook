import { useState, useCallback } from 'react'
import { addFavorite, removeFavorite, fetchFavorites } from '../services/api'
import { usePlaces } from '../hooks/usePlaces'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import PlaceCard from '../components/PlaceCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useEffect } from 'react'

export default function HomePage() {
  const [searchText, setSearchText] = useState('')
  const [favoritedIds, setFavoritedIds] = useState(new Set())

  const { places, loading, error, filters, updateFilters, resetFilters } = usePlaces()

  // Load existing favorites on mount
  useEffect(() => {
    fetchFavorites()
      .then((favs) => setFavoritedIds(new Set(favs.map((f) => f.place_id))))
      .catch(() => {}) // non-critical
  }, [])

  // Debounce search input into the filter state
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchText || undefined })
    }, 350)
    return () => clearTimeout(timer)
  }, [searchText, updateFilters])

  const handleReset = useCallback(() => {
    setSearchText('')
    resetFilters()
  }, [resetFilters])

  const handleToggleFavorite = useCallback(async (placeId) => {
    const isFav = favoritedIds.has(placeId)
    // Optimistic update
    setFavoritedIds((prev) => {
      const next = new Set(prev)
      isFav ? next.delete(placeId) : next.add(placeId)
      return next
    })
    try {
      if (isFav) {
        await removeFavorite(placeId)
      } else {
        await addFavorite(placeId)
      }
    } catch {
      // Revert on failure
      setFavoritedIds((prev) => {
        const next = new Set(prev)
        isFav ? next.add(placeId) : next.delete(placeId)
        return next
      })
    }
  }, [favoritedIds])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Find your perfect{' '}
          <span className="text-brand-600">work spot</span>
        </h1>
        <p className="mt-2 text-gray-500 text-base max-w-xl mx-auto">
          Discover cafes, libraries, and coworking spaces rated for Wi-Fi, noise, and comfort.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4 max-w-2xl mx-auto">
        <SearchBar value={searchText} onChange={setSearchText} />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterPanel
          filters={filters}
          onChange={updateFilters}
          onReset={handleReset}
        />
      </div>

      {/* Results header */}
      {!loading && !error && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {places.length === 0
              ? 'No places match your filters'
              : `${places.length} place${places.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      )}

      {/* States */}
      {loading && <LoadingSpinner message="Finding great spots…" />}

      {error && (
        <EmptyState
          title="Couldn't load places"
          subtitle={error}
          action={handleReset}
          actionLabel="Try again"
        />
      )}

      {!loading && !error && places.length === 0 && (
        <EmptyState
          title="No places found"
          subtitle="Try a different search or reset your filters."
          action={handleReset}
          actionLabel="Reset filters"
        />
      )}

      {/* Grid */}
      {!loading && !error && places.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isFavorited={favoritedIds.has(place.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

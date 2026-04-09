import { useState, useEffect, useCallback } from 'react'
import { fetchPlaces } from '../services/api'

/**
 * Custom hook that manages place fetching with filtering and loading state.
 * @param {Object} initialFilters
 */
export function usePlaces(initialFilters = {}) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  const loadPlaces = useCallback(async (activeFilters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPlaces(activeFilters)
      setPlaces(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load places. Is the server running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPlaces(filters)
  }, [filters, loadPlaces])

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  return { places, loading, error, filters, updateFilters, resetFilters }
}

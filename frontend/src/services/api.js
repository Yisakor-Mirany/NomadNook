import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Places ────────────────────────────────────────────────────────────────────

/**
 * Fetch places with optional filters.
 * @param {Object} filters - query params (city, search, category, etc.)
 */
export const fetchPlaces = async (filters = {}) => {
  // Strip out empty / undefined values so they don't pollute the query string
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )
  const { data } = await api.get('/places', { params })
  return data
}

/**
 * Fetch a single place by ID.
 * @param {number} id
 */
export const fetchPlaceById = async (id) => {
  const { data } = await api.get(`/places/${id}`)
  return data
}

// ── Favorites ─────────────────────────────────────────────────────────────────

export const fetchFavorites = async () => {
  const { data } = await api.get('/favorites')
  return data
}

/**
 * @param {number} placeId
 */
export const addFavorite = async (placeId) => {
  const { data } = await api.post('/favorites', { place_id: placeId })
  return data
}

/**
 * @param {number} placeId
 */
export const removeFavorite = async (placeId) => {
  await api.delete(`/favorites/${placeId}`)
}

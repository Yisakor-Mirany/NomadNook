import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Star, Wifi, Volume2, Zap, Armchair, DollarSign,
  Clock, MapPin, Heart, Tag,
} from 'lucide-react'
import { fetchPlaceById, addFavorite, removeFavorite, fetchFavorites } from '../services/api'
import MapPlaceholder from '../components/MapPlaceholder'
import LoadingSpinner from '../components/LoadingSpinner'

const NOISE_LABELS = {
  quiet: { label: 'Quiet', color: 'text-green-600', bg: 'bg-green-50' },
  moderate: { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  loud: { label: 'Lively', color: 'text-red-500', bg: 'bg-red-50' },
}

const OUTLET_LABELS = {
  none: { label: 'No outlets', color: 'text-red-500' },
  some: { label: 'Some outlets', color: 'text-yellow-600' },
  plenty: { label: 'Plenty of outlets', color: 'text-green-600' },
}

function MetricRow({ icon: Icon, label, value, color = 'text-gray-700' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2.5 text-sm text-gray-600">
        <Icon size={16} className="text-gray-400" />
        {label}
      </div>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  )
}

function StarRating({ value, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < value ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

export default function PlaceDetailPage() {
  const { id } = useParams()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [placeData, favs] = await Promise.all([
          fetchPlaceById(id),
          fetchFavorites().catch(() => []),
        ])
        setPlace(placeData)
        setIsFavorited(favs.some((f) => f.place_id === placeData.id))
      } catch (err) {
        setError(err.response?.data?.detail || 'Place not found.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleToggleFavorite = async () => {
    if (favLoading) return
    setFavLoading(true)
    try {
      if (isFavorited) {
        await removeFavorite(place.id)
        setIsFavorited(false)
      } else {
        await addFavorite(place.id)
        setIsFavorited(true)
      }
    } catch {
      // silently fail — in production show a toast
    } finally {
      setFavLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading place details…" />

  if (error || !place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{error || 'Place not found.'}</p>
        <Link to="/" className="text-brand-600 font-semibold hover:underline">
          ← Back to Explore
        </Link>
      </div>
    )
  }

  const noiseInfo = NOISE_LABELS[place.noise_level] || { label: place.noise_level, color: 'text-gray-600', bg: 'bg-gray-50' }
  const outletInfo = OUTLET_LABELS[place.outlet_availability] || { label: place.outlet_availability, color: 'text-gray-600' }
  const tags = place.tags ? place.tags.split(',').map((t) => t.trim()) : []
  const fallbackImage = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft size={15} />
        Back to Explore
      </Link>

      {/* Hero image */}
      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100">
        <img
          src={place.image_url || fallbackImage}
          alt={place.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = fallbackImage }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Status badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 capitalize text-gray-800">
            {place.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            place.open_now ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'
          }`}>
            {place.open_now ? 'Open Now' : 'Closed'}
          </span>
        </div>
        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          disabled={favLoading}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm
                     flex items-center justify-center shadow-md hover:bg-white transition disabled:opacity-60"
          aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            size={18}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column — main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name & rating */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{place.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {place.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <StarRating value={Math.round(place.rating)} />
                  <span className="text-sm font-semibold text-gray-800">{place.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({place.review_count} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={13} />
                {place.address}, {place.city}
              </div>
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm leading-relaxed">{place.description}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Tag size={14} /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2.5 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hours */}
          {place.hours && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Clock size={14} /> Hours
              </h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">{place.hours}</p>
            </div>
          )}

          {/* Work suitability notes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Work / Study Suitability</h3>
            <div className="bg-white border border-gray-200 rounded-xl px-4 divide-y divide-gray-100">
              <MetricRow
                icon={Wifi}
                label="Wi-Fi Quality"
                value={`${place.wifi_rating}/5`}
                color="text-brand-600"
              />
              <MetricRow
                icon={Volume2}
                label="Noise Level"
                value={noiseInfo.label}
                color={noiseInfo.color}
              />
              <MetricRow
                icon={Zap}
                label="Outlets"
                value={outletInfo.label}
                color={outletInfo.color}
              />
              <MetricRow
                icon={Armchair}
                label="Seating Comfort"
                value={`${place.seating_comfort}/5`}
                color="text-gray-700"
              />
              <MetricRow
                icon={DollarSign}
                label="Entry Cost"
                value={place.is_free ? 'Free' : 'Paid'}
                color={place.is_free ? 'text-green-600' : 'text-gray-600'}
              />
            </div>
          </div>
        </div>

        {/* Right column — map */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Location</h3>
          <MapPlaceholder
            latitude={place.latitude}
            longitude={place.longitude}
            name={place.name}
          />
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600 space-y-1">
            <div className="font-semibold text-gray-800">{place.name}</div>
            <div className="text-gray-500">{place.address}</div>
            <div className="text-gray-500">{place.city}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Wifi, Volume2, Zap, Star, Heart, MapPin, DollarSign } from 'lucide-react'

const CATEGORY_COLORS = {
  cafe: 'bg-amber-100 text-amber-800',
  library: 'bg-blue-100 text-blue-800',
  coworking: 'bg-purple-100 text-purple-800',
}

const NOISE_LABELS = {
  quiet: { label: 'Quiet', color: 'text-green-600' },
  moderate: { label: 'Moderate', color: 'text-yellow-600' },
  loud: { label: 'Lively', color: 'text-red-500' },
}

const OUTLET_LABELS = {
  none: 'No outlets',
  some: 'Some outlets',
  plenty: 'Plenty of outlets',
}

function WifiDots({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all ${
            i <= rating ? 'bg-brand-500 h-3' : 'bg-gray-200 h-2'
          }`}
          style={{ height: i <= rating ? `${6 + i * 2}px` : '8px' }}
        />
      ))}
    </div>
  )
}

/**
 * Place summary card for the list/grid view.
 * @param {Object}   place
 * @param {boolean}  isFavorited
 * @param {function} onToggleFavorite
 */
export default function PlaceCard({ place, isFavorited, onToggleFavorite }) {
  const categoryColor = CATEGORY_COLORS[place.category] || 'bg-gray-100 text-gray-700'
  const noiseInfo = NOISE_LABELS[place.noise_level] || { label: place.noise_level, color: 'text-gray-500' }
  const fallbackImage = `https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800`

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={place.image_url || fallbackImage}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = fallbackImage }}
        />
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColor}`}>
          {place.category}
        </span>
        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(place.id) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center
                     justify-center shadow-sm hover:bg-white transition"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={15}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
        {/* Open/Closed badge */}
        <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
          place.open_now ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'
        }`}>
          {place.open_now ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div>
          <Link to={`/places/${place.id}`} className="hover:text-brand-600 transition">
            <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-1">{place.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MapPin size={11} />
            <span className="truncate">{place.address}</span>
          </div>
        </div>

        {/* Rating */}
        {place.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-800">{place.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({place.review_count} reviews)</span>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2">
            <Wifi size={13} className="text-brand-500" />
            <WifiDots rating={place.wifi_rating} />
            <span className="text-[10px] text-gray-500">Wi-Fi</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2">
            <Volume2 size={13} className={noiseInfo.color} />
            <span className={`text-[10px] font-medium ${noiseInfo.color}`}>{noiseInfo.label}</span>
            <span className="text-[10px] text-gray-500">Noise</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2">
            <Zap size={13} className="text-yellow-500" />
            <span className="text-[10px] font-medium text-gray-700 capitalize">
              {place.outlet_availability}
            </span>
            <span className="text-[10px] text-gray-500">Outlets</span>
          </div>
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{place.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className={`flex items-center gap-1 text-xs font-medium ${
            place.is_free ? 'text-green-600' : 'text-gray-500'
          }`}>
            <DollarSign size={12} />
            {place.is_free ? 'Free' : 'Paid'}
          </span>
          <Link
            to={`/places/${place.id}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  )
}

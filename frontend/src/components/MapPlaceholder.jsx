import { Map, ExternalLink } from 'lucide-react'

/**
 * Map section placeholder.
 * Replace the inner content with a Mapbox / Google Maps embed when ready.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} name       - place name for the link label
 */
export default function MapPlaceholder({ latitude, longitude, name }) {
  const hasCoords = latitude && longitude

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : null

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center gap-3">
      {/* Grid overlay for map aesthetic */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative flex flex-col items-center gap-2 text-center px-4">
        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
          <Map size={22} className="text-brand-500" />
        </div>
        {hasCoords ? (
          <>
            <p className="text-sm text-gray-600 font-medium">
              {latitude.toFixed(4)}°N, {Math.abs(longitude).toFixed(4)}°W
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800 transition"
            >
              Open in Google Maps
              <ExternalLink size={13} />
            </a>
            <p className="text-xs text-gray-400 mt-1">
              Integrate Mapbox or Google Maps SDK to display an interactive map here.
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Location data not available</p>
        )}
      </div>
    </div>
  )
}

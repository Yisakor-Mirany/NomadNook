import { Coffee } from 'lucide-react'

/**
 * Empty / zero-results state.
 * @param {string}   title
 * @param {string}   subtitle
 * @param {function} action    - optional CTA callback
 * @param {string}   actionLabel
 */
export default function EmptyState({
  title = 'No places found',
  subtitle = 'Try adjusting your search or filters.',
  action,
  actionLabel = 'Reset filters',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <Coffee size={28} className="text-gray-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">{subtitle}</p>
      </div>
      {action && (
        <button
          onClick={action}
          className="text-sm font-semibold text-brand-600 hover:text-brand-800 underline underline-offset-2 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

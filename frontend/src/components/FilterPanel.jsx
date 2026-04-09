import { SlidersHorizontal, RotateCcw } from 'lucide-react'

const NOISE_OPTIONS = [
  { value: '', label: 'Any noise' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'loud', label: 'Lively' },
]

const OUTLET_OPTIONS = [
  { value: '', label: 'Any outlets' },
  { value: 'none', label: 'None' },
  { value: 'some', label: 'Some' },
  { value: 'plenty', label: 'Plenty' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'library', label: 'Library' },
  { value: 'coworking', label: 'Coworking' },
]

const WIFI_OPTIONS = [
  { value: '', label: 'Any Wi-Fi' },
  { value: '3', label: '3+ stars' },
  { value: '4', label: '4+ stars' },
  { value: '5', label: '5 stars only' },
]

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none
                   focus:ring-2 focus:ring-brand-400 focus:border-transparent transition cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function ToggleFilter({ label, checked, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <button
        onClick={() => onChange(checked ? undefined : true)}
        className={`text-sm px-3 py-2 rounded-lg border font-medium transition ${
          checked
            ? 'bg-brand-500 text-white border-brand-500'
            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-400'
        }`}
      >
        {checked ? 'Yes ✓' : 'Any'}
      </button>
    </div>
  )
}

/**
 * Filter controls panel.
 * @param {Object}   filters    - current filter state
 * @param {function} onChange   - called with { key: value } patches
 * @param {function} onReset    - called to reset all filters
 */
export default function FilterPanel({ filters, onChange, onReset }) {
  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '' && v !== null
  )

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <SlidersHorizontal size={16} />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium transition"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        <SelectFilter
          label="Category"
          value={filters.category || ''}
          onChange={(v) => onChange({ category: v || undefined })}
          options={CATEGORY_OPTIONS}
        />
        <SelectFilter
          label="Wi-Fi"
          value={filters.min_wifi_rating || ''}
          onChange={(v) => onChange({ min_wifi_rating: v ? parseInt(v) : undefined })}
          options={WIFI_OPTIONS}
        />
        <SelectFilter
          label="Noise Level"
          value={filters.noise_level || ''}
          onChange={(v) => onChange({ noise_level: v || undefined })}
          options={NOISE_OPTIONS}
        />
        <SelectFilter
          label="Outlets"
          value={filters.outlet_availability || ''}
          onChange={(v) => onChange({ outlet_availability: v || undefined })}
          options={OUTLET_OPTIONS}
        />
        <ToggleFilter
          label="Open Now"
          checked={filters.open_now === true}
          onChange={(v) => onChange({ open_now: v })}
        />
        <ToggleFilter
          label="Free Entry"
          checked={filters.is_free === true}
          onChange={(v) => onChange({ is_free: v })}
        />
      </div>
    </div>
  )
}

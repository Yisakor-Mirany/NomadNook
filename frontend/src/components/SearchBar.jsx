import { useState } from 'react'
import { Search, X } from 'lucide-react'

/**
 * Controlled search bar component.
 * @param {string}   value        - current search text
 * @param {function} onChange     - called with new string value on change
 * @param {string}   placeholder
 */
export default function SearchBar({ value, onChange, placeholder = 'Search by city, name, or vibe…' }) {
  const handleClear = () => onChange('')

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
                   transition placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

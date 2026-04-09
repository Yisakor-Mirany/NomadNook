import { Link, NavLink } from 'react-router-dom'
import { MapPin, Heart, Coffee } from 'lucide-react'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Coffee size={16} className="text-white" />
            </div>
            <span>
              Nomad<span className="text-brand-600">Nook</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              <MapPin size={15} />
              Explore
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              <Heart size={15} />
              Favorites
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ChevronDown, Menu, X, LogOut } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  badge?: number
}

export interface ProfileAction {
  label: string
  icon: React.ElementType
  onClick: () => void
  danger?: boolean
}

export interface BaseNavbarProps {
  // Branding
  logoIcon: React.ElementType
  logoTitle: string
  logoSubtitle?: string

  // Navigation
  navItems: NavItem[]

  // Profile
  displayName: string
  roleLabel: string

  // Colors — use CSS variable strings or Tailwind class names
  // bgClass: Tailwind class for the navbar background (e.g. 'bg-directrice')
  // activeClass: Tailwind class for the active link (e.g. 'text-directrice')
  bgClass: string
  activeTextClass: string

  // Extra slot — e.g. "Mode Enseignante" button, role pill
  rightSlot?: React.ReactNode

  // Profile dropdown extra actions (before logout)
  extraProfileActions?: ProfileAction[]

  onLogout?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BaseNavbar({
  logoIcon: LogoIcon,
  logoTitle,
  logoSubtitle,
  navItems,
  displayName,
  roleLabel,
  bgClass,
  activeTextClass,
  rightSlot,
  extraProfileActions = [],
  onLogout,
}: BaseNavbarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  function handleLogout() {
    logout()          // clears store + localStorage token
    onLogout?.()      // optional post-logout callback from parent
    navigate('/login')
  }

  return (
    <nav className={`w-full shadow-md ${bgClass}`}>
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <LogoIcon size={18} className="text-white" />
          </div>
          {(logoTitle || logoSubtitle) && (
            <div className="hidden sm:block leading-tight">
              <p className="text-white font-semibold text-sm">{logoTitle}</p>
              {logoSubtitle && <p className="text-white/60 text-xs font-light">{logoSubtitle}</p>}
            </div>
          )}
        </div>

        {/* ── Desktop nav ── */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map(({ label, to, icon: Icon, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 relative
                  ${isActive
                    ? `bg-white ${activeTextClass}`
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon size={15} />
                <span>{label}</span>
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">

          {/* Extra slot (e.g. Mode Enseignante, Role pill) */}
          {rightSlot}

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-white text-sm font-medium max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDown
                size={14}
                className={`text-white/70 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Connecté(e) en tant que</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${bgClass}`}>
                    {roleLabel}
                  </span>
                </div>

                {extraProfileActions.map(({ label, icon: Icon, onClick, danger }) => (
                  <button
                    key={label}
                    onClick={() => { onClick(); setProfileOpen(false) }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                      danger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={15} className={danger ? 'text-red-400' : 'text-gray-400'} />
                    {label}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} className="text-red-400" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            {mobileOpen
              ? <X size={20} className="text-white" />
              : <Menu size={20} className="text-white" />
            }
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/15 px-4 py-3 space-y-1">
          {navItems.map(({ label, to, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${isActive
                  ? `bg-white ${activeTextClass}`
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
              {badge != null && badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-2 border-t border-white/10">
            {extraProfileActions.map(({ label, icon: Icon, onClick, danger }) => (
              <button
                key={label}
                onClick={() => { onClick(); setMobileOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  danger ? 'text-red-300 hover:bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-300 hover:bg-white/10 transition-colors"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </nav>
  )
}
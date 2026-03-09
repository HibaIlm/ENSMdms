import { useAuthStore, type AuthUser } from '../store/authStore'
import type { Role } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface UseAuthReturn {
  // State
  user: AuthUser | null
  isAuthenticated: boolean
  role: Role | null

  // Role helpers — avoids role string comparisons in components
  isDirectrice: boolean
  isEnseignant: boolean
  isCSD: boolean

  // Display helpers
  fullName: string
  initials: string

  // Actions
  logout: () => void

  // Role checker for programmatic use
  hasRole: (role: Role | Role[]) => boolean
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore()

  const role = user?.role ?? null

  // ── Role booleans ─────────────────────────────────────────────────────────
  // Use these in components instead of comparing role strings directly.
  // Example: if (isDirectrice) instead of if (role === 'directrice')
  // This makes refactoring role names easier and avoids typos.

  const isDirectrice = role === 'directrice'
  const isEnseignant = role === 'enseignant'
  const isCSD = role === 'csd'

  // ── Display helpers ───────────────────────────────────────────────────────

  const fullName = user ? `${user.prenom} ${user.nom}` : ''
  const initials = user
    ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()
    : ''

  // ── Role checker ──────────────────────────────────────────────────────────
  // Accepts a single role or an array of roles.
  // Example: hasRole(['directrice', 'csd']) → true if user has either role

  function hasRole(allowedRole: Role | Role[]): boolean {
    if (!role) return false
    if (Array.isArray(allowedRole)) return allowedRole.includes(role)
    return role === allowedRole
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  // Calls store logout (clears state + localStorage).
  // When backend is ready: also call authService.logout() here to
  // invalidate the server-side session if needed.

  function logout() {
    storeLogout()
    // authService.logout() ← uncomment if backend needs a logout endpoint
  }

  return {
    user,
    isAuthenticated,
    role,
    isDirectrice,
    isEnseignant,
    isCSD,
    fullName,
    initials,
    logout,
    hasRole,
  }
}
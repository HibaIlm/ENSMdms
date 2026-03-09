import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  /**
   * Roles allowed to access this route.
   * If empty or undefined, any authenticated user can access.
   */
  allowedRoles?: Role[]
}

// ── Redirect map ──────────────────────────────────────────────────────────────
// Where to send each role after a successful login.
// Single source of truth — if routes change, update here only.

const ROLE_HOME: Record<Role, string> = {
  directrice: '/dashboard',
  enseignant: '/ens/dashboard',
  csd: '/csd/dashboard',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, hasRole } = useAuth()
  const location = useLocation()

  // ── Not logged in → redirect to login ─────────────────────────────────────
  // Saves the current location so we can redirect back after login.
  // When backend is ready, this also handles expired token cases
  // since the axios interceptor in client.ts calls logout() on 401.

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // ── Wrong role → redirect to own dashboard ────────────────────────────────
  // Example: an enseignant trying to access /dashboard gets sent to /ens/dashboard.
  // This is safer than showing a 403 because it avoids leaking that the route exists.

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    const home = ROLE_HOME[role]
    return <Navigate to={home} replace />
  }

  // ── Authorized → render child routes ─────────────────────────────────────
  return <Outlet />
}
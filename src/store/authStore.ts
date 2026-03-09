import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Role } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

// AuthUser IS User — single source of truth for the shape of a logged-in user.
// All role-specific optional fields (csdRole, departement) live on User in types/index.ts.
export type AuthUser = User

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
  setMockUser: (user: AuthUser) => void
}

// ── Mock users ────────────────────────────────────────────────────────────────
// MOCK_USERS: keyed by Role — used for the default auto-login (one per role).
// MOCK_DEV_PROFILES: flat list — used by DevRoleSwitcher to expose all variants
// including both CSD roles (validation + consultation).
//
// When backend is ready: remove both exports and all setMockUser calls.

export const MOCK_USERS: Record<Role, AuthUser> = {
  directrice: {
    id: 'mock-directrice-1',
    nom: 'Mohamed El Hadj',
    prenom: 'Leila',
    email: 'l.mohammedelhadj@ensmanagement.edu.dz',
    role: 'directrice',
  },
  enseignant: {
    id: 'mock-enseignant-1',
    nom: 'Meziane',
    prenom: 'Karim',
    email: 'k.meziane@ensmanagement.edu.dz',
    role: 'enseignant',
    departement: 'Département Management et Entrepreneuriat',
  },
  // Default CSD mock is validation — covers the most permissive case
  csd: {
    id: 'mock-csd-validation-1',
    nom: 'Khelil',
    prenom: 'Amine',
    email: 'a.khelil@ensmanagement.edu.dz',
    role: 'csd',
    csdRole: 'validation',
    departement: 'Département Management des Organisations',
  },
}

// ── Dev profiles ──────────────────────────────────────────────────────────────
// Flat list of all testable user profiles for the DevRoleSwitcher.
// Add new profiles here to test edge cases (e.g. a CSD member with no dossiers).

export interface DevProfile {
  label: string
  color: string
  user: AuthUser
}

export const MOCK_DEV_PROFILES: DevProfile[] = [
  {
    label: 'Directrice',
    color: 'var(--color-directrice)',
    user: MOCK_USERS.directrice,
  },
  {
    label: 'Enseignant',
    color: 'var(--color-enseignant)',
    user: MOCK_USERS.enseignant,
  },
  {
    label: 'CSD — Validation',
    color: 'var(--color-csd-role-validation-text)',
    user: MOCK_USERS.csd,
  },
  {
    label: 'CSD — Consultation',
    color: 'var(--color-csd-role-consultation-text)',
    user: {
      id: 'mock-csd-consultation-1',
      nom: 'Boukhalfa',
      prenom: 'Sara',
      email: 's.boukhalfa@ensmanagement.edu.dz',
      role: 'csd',
      csdRole: 'consultation',
      departement: 'Département Management des Organisations ',
    },
  },
]

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Called after a successful real login API response.
       * Backend: POST /auth/login → { user, token }
       */
      setAuth: (user: AuthUser, token: string) => {
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },

      /**
       * Clears all auth state and token.
       * Backend: optionally POST /auth/logout to invalidate server-side session.
       */
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      /**
       * Sets a mock user for development/testing without a real token.
       * Remove all calls to this when backend is ready.
       */
      setMockUser: (user: AuthUser) => {
        set({ user, token: 'mock-token', isAuthenticated: true })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
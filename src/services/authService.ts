import api from '../api/client'
import type { Enseignant } from '../types'

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  nom: string
  prenom: string
  grade: string
  departement: string
  email: string
  motDePasse: string
  telephone?: string
  specialite?: string
}

export interface LoginPayload {
  email: string
  motDePasse: string
}

export interface LoginResponse {
  token: string
  user: Enseignant
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const UNIVERSITY_DOMAINS = [
  'ensmanagement.edu.dz',
]

export const GRADES = [
  'Professeur',
  'Maître de conférences A',
  'Maître de conférences B',
  'Maître assistant A',
  'Maître assistant B',
  'Attaché de recherche',
]

export const DEPARTEMENTS = [
  'Département Management et Entrepreneuriat',
  'Département Management des Organisations',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function isValidUniversityEmail(email: string): boolean {
  return UNIVERSITY_DOMAINS.some((domain) => email.endsWith(`@${domain}`))
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Faible', color: 'var(--color-status-refuse)' }
  if (score === 2) return { score, label: 'Moyen', color: 'var(--color-status-evaluation)' }
  if (score === 3) return { score, label: 'Bon', color: 'var(--color-status-corrections)' }
  return { score, label: 'Fort', color: 'var(--color-status-accepte)' }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const authService = {

  /**
   * Register a new enseignant account.
   * Backend endpoint: POST /auth/register
   */
  register: async (payload: RegisterPayload): Promise<void> => {
    // ── MOCK (remove when backend is ready) ──────────────────────────────────
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Register payload:', payload)
    return
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API (uncomment when backend is ready) ───────────────────────────
    // await api.post('/auth/register', payload)
  },

  /**
   * Login and get JWT token.
   * Backend endpoint: POST /auth/login
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', payload)
    return response.data
  },

  /**
   * Logout — clears local token.
   */
  logout: (): void => {
    localStorage.removeItem('token')
  },
}

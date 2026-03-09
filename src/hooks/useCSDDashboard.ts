import { useState, useEffect } from 'react'
import {
  csdDashboardService,
  type CSDDashboardStats,
  type DossierUrgent,
} from '../services/csdDashboardService'

// ── State ─────────────────────────────────────────────────────────────────────

interface UseCSDDashboardState {
  stats: CSDDashboardStats | null
  dossiersUrgents: DossierUrgent[]
  isLoading: boolean
  error: string | null
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCSDDashboard() {
  const [state, setState] = useState<UseCSDDashboardState>({
    stats: null,
    dossiersUrgents: [],
    isLoading: true,
    error: null,
  })

  async function fetchAll() {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const [stats, dossiersUrgents] = await Promise.all([
        csdDashboardService.getStats(),
        csdDashboardService.getDossiersUrgents(),
      ])
      setState({ stats, dossiersUrgents, isLoading: false, error: null })
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Impossible de charger le tableau de bord. Veuillez réessayer.',
      }))
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return { ...state, refresh: fetchAll }
}

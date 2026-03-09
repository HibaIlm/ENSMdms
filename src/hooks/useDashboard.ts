import { useState, useEffect } from 'react'
import {
  dashboardService,
  type DashboardStats,
  type ActiviteCSD,
  type CategoryStat,
  type DistributionStat,
} from '../services/dashboardService'
import type { Dossier } from '../types'

// ── State ─────────────────────────────────────────────────────────────────────

interface UseDashboardState {
  stats: DashboardStats | null
  dossiersRecents: Dossier[]
  activiteCSD: ActiviteCSD[]
  distribution: DistributionStat[]
  categories: CategoryStat[]
  isLoading: boolean
  error: string | null
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDashboard() {
  const [state, setState] = useState<UseDashboardState>({
    stats: null,
    dossiersRecents: [],
    activiteCSD: [],
    distribution: [],
    categories: [],
    isLoading: true,
    error: null,
  })

  async function fetchAll() {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const [stats, dossiersRecents, activiteCSD, distribution, categories] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getDossiersRecents(),
          dashboardService.getActiviteCSD(),
          dashboardService.getDistribution(),
          dashboardService.getCategories(),
        ])
      setState({ stats, dossiersRecents, activiteCSD, distribution, categories, isLoading: false, error: null })
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

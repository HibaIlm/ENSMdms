import { useState, useEffect, useCallback } from 'react'
import {
  dossiersAssignesService,
  type DossierAssigne,
  type DossiersAssignesFilters,
  type DossiersAssignesStats,
  type EvaluationStatut,
} from '../services/dossiersAssignesService'
import type { Categorie } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface UseDossiersAssignesState {
  dossiers: DossierAssigne[]
  stats: DossiersAssignesStats | null
  totalPages: number
  total: number
  isLoading: boolean
  error: string | null
}

interface ActiveFilters {
  search: string
  evaluationStatut: EvaluationStatut | 'tous'
  categorie: Categorie | 'tous'
  page: number
}

const PAGE_SIZE = 6

const INITIAL_FILTERS: ActiveFilters = {
  search: '',
  evaluationStatut: 'tous',
  categorie: 'tous',
  page: 1,
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDossiersAssignes() {
  const [filters, setFilters] = useState<ActiveFilters>(INITIAL_FILTERS)

  const [state, setState] = useState<UseDossiersAssignesState>({
    dossiers: [],
    stats: null,
    totalPages: 1,
    total: 0,
    isLoading: true,
    error: null,
  })

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchDossiers = useCallback(async (activeFilters: ActiveFilters) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const params: DossiersAssignesFilters = {
        ...activeFilters,
        pageSize: PAGE_SIZE,
      }

      const [result, stats] = await Promise.all([
        dossiersAssignesService.getDossiersAssignes(params),
        dossiersAssignesService.getStats(),
      ])

      setState({
        dossiers: result.data,
        stats,
        totalPages: result.totalPages,
        total: result.total,
        isLoading: false,
        error: null,
      })
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Impossible de charger les dossiers. Veuillez réessayer.',
      }))
    }
  }, [])

  useEffect(() => {
    fetchDossiers(filters)
  }, [filters, fetchDossiers])

  // ── Filter handlers ───────────────────────────────────────────────────────
  // Every filter change resets to page 1 — except page changes.

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }

  function setEvaluationStatut(evaluationStatut: EvaluationStatut | 'tous') {
    setFilters((prev) => ({ ...prev, evaluationStatut, page: 1 }))
  }

  function setCategorie(categorie: Categorie | 'tous') {
    setFilters((prev) => ({ ...prev, categorie, page: 1 }))
  }

  function setPage(page: number) {
    setFilters((prev) => ({ ...prev, page }))
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.evaluationStatut !== 'tous' ||
    filters.categorie !== 'tous'

  return {
    // Data
    ...state,
    // Filters
    filters,
    hasActiveFilters,
    pageSize: PAGE_SIZE,
    // Handlers
    setSearch,
    setEvaluationStatut,
    setCategorie,
    setPage,
    resetFilters,
    refresh: () => fetchDossiers(filters),
  }
}

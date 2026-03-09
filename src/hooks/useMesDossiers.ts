import { useState, useEffect, useCallback } from 'react'
import { dossierService, type DossierFilters, type DossierStats, computeStats } from '../services/dossierService'
import type { Dossier, Statut, Categorie } from '../types'
import { DEFAULT_PAGE_SIZE } from '../constants/dossierConfig'

// ── State interface ───────────────────────────────────────────────────────────

interface UseMesDossiersState {
  dossiers: Dossier[]
  stats: DossierStats
  total: number
  totalPages: number
  currentPage: number
  isLoading: boolean
  error: string | null
  search: string
  filterStatut: Statut | 'tous'
  filterCategorie: Categorie | 'tous'
}

interface UseMesDossiersActions {
  setSearch: (value: string) => void
  setFilterStatut: (value: Statut | 'tous') => void
  setFilterCategorie: (value: Categorie | 'tous') => void
  setCurrentPage: (page: number) => void
  clearFilters: () => void
  refresh: () => void
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMesDossiers(): UseMesDossiersState & UseMesDossiersActions {
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [stats, setStats] = useState<DossierStats>({
    total: 0,
    soumis: 0,
    en_evaluation: 0,
    accepte: 0,
    refuse: 0,
    corrections: 0,
  })
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearchRaw] = useState('')
  const [filterStatut, setFilterStatutRaw] = useState<Statut | 'tous'>('tous')
  const [filterCategorie, setFilterCategorieRaw] = useState<Categorie | 'tous'>('tous')
  const [currentPage, setCurrentPageRaw] = useState(1)

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchDossiers = useCallback(async (filters: DossierFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await dossierService.getMesDossiers(filters)
      setDossiers(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)

      // Compute stats from full list (mock) — with real backend,
      // stats will come from a dedicated endpoint like GET /dossiers/stats
      const allResponse = await dossierService.getMesDossiers({ pageSize: 9999 })
      setStats(computeStats(allResponse.data))
    } catch (err) {
      setError('Impossible de charger les dossiers. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDossiers({
      search,
      statut: filterStatut,
      categorie: filterCategorie,
      page: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    })
  }, [search, filterStatut, filterCategorie, currentPage, fetchDossiers])

  // ── Actions ───────────────────────────────────────────────────────────────

  const setSearch = (value: string) => {
    setSearchRaw(value)
    setCurrentPageRaw(1)
  }

  const setFilterStatut = (value: Statut | 'tous') => {
    setFilterStatutRaw(value)
    setCurrentPageRaw(1)
  }

  const setFilterCategorie = (value: Categorie | 'tous') => {
    setFilterCategorieRaw(value)
    setCurrentPageRaw(1)
  }

  const setCurrentPage = (page: number) => {
    setCurrentPageRaw(page)
  }

  const clearFilters = () => {
    setSearchRaw('')
    setFilterStatutRaw('tous')
    setFilterCategorieRaw('tous')
    setCurrentPageRaw(1)
  }

  const refresh = () => {
    fetchDossiers({
      search,
      statut: filterStatut,
      categorie: filterCategorie,
      page: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    })
  }

  return {
    dossiers,
    stats,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    search,
    filterStatut,
    filterCategorie,
    setSearch,
    setFilterStatut,
    setFilterCategorie,
    setCurrentPage,
    clearFilters,
    refresh,
  }
}

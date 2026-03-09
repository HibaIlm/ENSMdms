import type { Dossier } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalDossiers: number
  enAttente: number
  enEvaluation: number
  decisionsRendues: number
  comptesEnAttente: number
  messagesNonLus: number
}

export interface ActiviteCSD {
  csd: 1 | 2
  departement: string
  total: number
  enAttente: number
  evalues: number
  membresActifs: number
}

export interface CategoryStat {
  label: string
  value: number
  color: string
}

export interface DistributionStat {
  label: string
  value: number
  color: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_STATS: DashboardStats = {
  totalDossiers: 47,
  enAttente: 6,
  enEvaluation: 8,
  decisionsRendues: 33,
  comptesEnAttente: 3,
  messagesNonLus: 2,
}

const MOCK_DOSSIERS_RECENTS: Dossier[] = [
  { id: 'D-2025-001', titre: "Introduction à l'Intelligence Artificielle", categorie: 'cours_en_ligne', statut: 'soumis', datesoumission: '2025-03-06' },
  { id: 'D-2025-002', titre: 'Algorithmes de tri avancés', categorie: 'publication', statut: 'en_evaluation', datesoumission: '2025-03-05', csdAssigne: 1 },
  { id: 'D-2025-003', titre: 'Analyse mathématique — Tome II', categorie: 'ouvrage', statut: 'accepte', datesoumission: '2025-03-04', csdAssigne: 2 },
  { id: 'D-2025-004', titre: 'Réseaux de neurones convolutifs', categorie: 'publication', statut: 'corrections', datesoumission: '2025-03-03', csdAssigne: 1 },
  { id: 'D-2025-005', titre: 'Physique quantique appliquée', categorie: 'cours_en_ligne', statut: 'refuse', datesoumission: '2025-03-02', csdAssigne: 2 },
]

const MOCK_ACTIVITE_CSD: ActiviteCSD[] = [
  { csd: 1, departement: 'Management et Entrepreneuriat', total: 18, enAttente: 4, evalues: 14, membresActifs: 5 },
  { csd: 2, departement: 'Management des Organisations', total: 12, enAttente: 3, evalues: 9, membresActifs: 4 },
]

const MOCK_DISTRIBUTION: DistributionStat[] = [
  { label: 'Soumis', value: 6, color: 'var(--color-status-soumis)' },
  { label: 'En évaluation', value: 8, color: 'var(--color-status-evaluation)' },
  { label: 'Acceptés', value: 20, color: 'var(--color-status-accepte)' },
  { label: 'Corrections', value: 7, color: 'var(--color-status-corrections)' },
  { label: 'Refusés', value: 6, color: 'var(--color-status-refuse)' },
]

const MOCK_CATEGORIES: CategoryStat[] = [
  { label: 'Cours en ligne', value: 18, color: '#0EA5E9' },
  { label: 'Publications', value: 21, color: '#8B5CF6' },
  { label: 'Ouvrages', value: 8, color: '#F97316' },
]

// ── Service ───────────────────────────────────────────────────────────────────

export const dashboardService = {

  /**
   * Fetch global dashboard stats for the Directrice.
   * Backend endpoint: GET /dashboard/stats
   */
  getStats: async (): Promise<DashboardStats> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_STATS
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<DashboardStats>('/dashboard/stats')
    // return response.data
  },

  /**
   * Fetch the 5 most recently submitted dossiers.
   * Backend endpoint: GET /dashboard/dossiers-recents
   */
  getDossiersRecents: async (): Promise<Dossier[]> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_DOSSIERS_RECENTS
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<Dossier[]>('/dashboard/dossiers-recents')
    // return response.data
  },

  /**
   * Fetch CSD activity summaries for both departments.
   * Backend endpoint: GET /dashboard/activite-csd
   */
  getActiviteCSD: async (): Promise<ActiviteCSD[]> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_ACTIVITE_CSD
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<ActiviteCSD[]>('/dashboard/activite-csd')
    // return response.data
  },

  /**
   * Fetch distribution stats by status.
   * Backend endpoint: GET /dashboard/distribution
   */
  getDistribution: async (): Promise<DistributionStat[]> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    return MOCK_DISTRIBUTION
    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<DistributionStat[]>('/dashboard/distribution')
    // return response.data
  },

  /**
   * Fetch dossier count by category.
   * Backend endpoint: GET /dashboard/categories
   */
  getCategories: async (): Promise<CategoryStat[]> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    return MOCK_CATEGORIES
    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<CategoryStat[]>('/dashboard/categories')
    // return response.data
  },
}

import type { Dossier } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CSDDashboardStats {
  totalAssignes: number
  nonEvalues: number
  enCours: number
  evalues: number
  messagesNonLus: number
}

export interface DossierUrgent extends Dossier {
  joursDepuisReception: number
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_STATS: CSDDashboardStats = {
  totalAssignes: 14,
  nonEvalues: 5,
  enCours: 2,
  evalues: 7,
  messagesNonLus: 3,
}

const MOCK_DOSSIERS_URGENTS: DossierUrgent[] = [
  {
    id: 'D-2025-002',
    titre: 'Algorithmes de tri avancés — Analyse comparative',
    categorie: 'publication',
    statut: 'en_evaluation',
    datesoumission: '2025-03-01',
    joursDepuisReception: 8,
  },
  {
    id: 'D-2025-005',
    titre: 'Cours de programmation orientée objet',
    categorie: 'cours_en_ligne',
    statut: 'soumis',
    datesoumission: '2025-03-03',
    joursDepuisReception: 6,
  },
  {
    id: 'D-2025-007',
    titre: 'Structures de données avancées',
    categorie: 'cours_en_ligne',
    statut: 'soumis',
    datesoumission: '2025-03-05',
    joursDepuisReception: 4,
  },
]

// ── Service ───────────────────────────────────────────────────────────────────

export const csdDashboardService = {

  /**
   * Fetch dashboard stats for the logged-in CSD member.
   * Backend endpoint: GET /csd/dashboard/stats
   */
  getStats: async (): Promise<CSDDashboardStats> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_STATS
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<CSDDashboardStats>('/csd/dashboard/stats')
    // return response.data
  },

  /**
   * Fetch the most urgent (oldest unprocessed) dossiers for this CSD member.
   * Backend endpoint: GET /csd/dashboard/urgents
   */
  getDossiersUrgents: async (): Promise<DossierUrgent[]> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_DOSSIERS_URGENTS
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<DossierUrgent[]>('/csd/dashboard/urgents')
    // return response.data
  },
}

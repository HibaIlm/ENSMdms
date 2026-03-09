import type { Dossier, PaginatedResponse, Categorie, Statut } from '../types'
import api from '../api/client'

// ── Filters interface ─────────────────────────────────────────────────────────

export interface DossierFilters {
  search?: string
  statut?: Statut | 'tous'
  categorie?: Categorie | 'tous'
  page?: number
  pageSize?: number
}

// ── Mock data (replace with real API calls when backend is ready) ─────────────

const MOCK_DOSSIERS: Dossier[] = [
  {
    id: 'D-2025-001',
    titre: "Introduction à l'Intelligence Artificielle",
    categorie: 'cours_en_ligne',
    statut: 'soumis',
    datesoumission: '2025-03-06',
  },
  {
    id: 'D-2025-002',
    titre: 'Algorithmes de tri avancés — Analyse comparative',
    categorie: 'publication',
    statut: 'en_evaluation',
    datesoumission: '2025-02-20',
  },
  {
    id: 'D-2025-003',
    titre: 'Analyse mathématique — Tome II',
    categorie: 'ouvrage',
    statut: 'accepte',
    datesoumission: '2025-02-10',
    dateDecision: '2025-02-28',
  },
  {
    id: 'D-2025-004',
    titre: 'Réseaux de neurones convolutifs pour la vision',
    categorie: 'publication',
    statut: 'corrections',
    datesoumission: '2025-01-25',
    dateDecision: '2025-02-15',
  },
  {
    id: 'D-2025-005',
    titre: 'Cours de programmation orientée objet',
    categorie: 'cours_en_ligne',
    statut: 'refuse',
    datesoumission: '2025-01-10',
    dateDecision: '2025-01-30',
  },
  {
    id: 'D-2025-006',
    titre: 'Deep Learning pour le traitement du langage naturel',
    categorie: 'publication',
    statut: 'accepte',
    datesoumission: '2024-12-15',
    dateDecision: '2025-01-05',
  },
  {
    id: 'D-2025-007',
    titre: 'Structures de données avancées',
    categorie: 'cours_en_ligne',
    statut: 'en_evaluation',
    datesoumission: '2024-12-01',
  },
  {
    id: 'D-2025-008',
    titre: 'Manuel de génie logiciel',
    categorie: 'ouvrage',
    statut: 'soumis',
    datesoumission: '2025-03-01',
  },
]

// ── Service ───────────────────────────────────────────────────────────────────
// Each method has a mock implementation now.
// To switch to real backend: remove the mock block and uncomment the api call.

export const dossierService = {

  /**
   * Fetch paginated & filtered dossiers for the logged-in enseignant.
   * Backend endpoint: GET /dossiers/mes-dossiers
   */
  getMesDossiers: async (
    filters: DossierFilters = {}
  ): Promise<PaginatedResponse<Dossier>> => {
    // ── MOCK (remove when backend is ready) ──────────────────────────────────
    const { search = '', statut = 'tous', categorie = 'tous', page = 1, pageSize = 5 } = filters

    const filtered = MOCK_DOSSIERS.filter((d) => {
      const matchSearch =
        d.titre.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase())
      const matchStatut = statut === 'tous' || d.statut === statut
      const matchCategorie = categorie === 'tous' || d.categorie === categorie
      return matchSearch && matchStatut && matchCategorie
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const data = filtered.slice((page - 1) * pageSize, page * pageSize)

    return { data, total, page, pageSize, totalPages }
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API (uncomment when backend is ready) ───────────────────────────
    // const response = await api.get<PaginatedResponse<Dossier>>('/dossiers/mes-dossiers', {
    //   params: filters,
    // })
    // return response.data
  },

  /**
   * Fetch a single dossier by ID.
   * Backend endpoint: GET /dossiers/:id
   */
  getDossierById: async (id: string): Promise<Dossier> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    const dossier = MOCK_DOSSIERS.find((d) => d.id === id)
    if (!dossier) throw new Error('Dossier introuvable')
    return dossier
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<Dossier>(`/dossiers/${id}`)
    // return response.data
  },

  /**
   * Submit a new dossier.
   * Backend endpoint: POST /dossiers
   */
  soumettreDossier: async (formData: FormData): Promise<Dossier> => {
    const response = await api.post<Dossier>('/dossiers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

// ── Stats helper ──────────────────────────────────────────────────────────────

export interface DossierStats {
  total: number
  soumis: number
  en_evaluation: number
  accepte: number
  refuse: number
  corrections: number
}

export function computeStats(dossiers: Dossier[]): DossierStats {
  return {
    total: dossiers.length,
    soumis: dossiers.filter((d) => d.statut === 'soumis').length,
    en_evaluation: dossiers.filter((d) => d.statut === 'en_evaluation').length,
    accepte: dossiers.filter((d) => d.statut === 'accepte').length,
    refuse: dossiers.filter((d) => d.statut === 'refuse').length,
    corrections: dossiers.filter((d) => d.statut === 'corrections').length,
  }
}

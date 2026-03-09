import type { Dossier, Categorie } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

export type EvaluationStatut = 'non_evalue' | 'en_cours' | 'evalue'

export interface DossierAssigne extends Dossier {
  evaluationStatut: EvaluationStatut
  dateReception: string
  joursEnAttente: number
}

export interface DossiersAssignesFilters {
  search?: string
  evaluationStatut?: EvaluationStatut | 'tous'
  categorie?: Categorie | 'tous'
  page?: number
  pageSize?: number
}

export interface DossiersAssignesStats {
  total: number
  nonEvalues: number
  enCours: number
  evalues: number
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DOSSIERS: DossierAssigne[] = [
  {
    id: 'D-2025-002',
    titre: 'Algorithmes de tri avancés — Analyse comparative',
    categorie: 'publication',
    statut: 'en_evaluation',
    datesoumission: '2025-02-20',
    dateReception: '2025-03-01',
    evaluationStatut: 'en_cours',
    joursEnAttente: 8,
  },
  {
    id: 'D-2025-005',
    titre: 'Cours de programmation orientée objet',
    categorie: 'cours_en_ligne',
    statut: 'en_evaluation',
    datesoumission: '2025-01-10',
    dateReception: '2025-03-03',
    evaluationStatut: 'non_evalue',
    joursEnAttente: 6,
  },
  {
    id: 'D-2025-007',
    titre: 'Structures de données avancées',
    categorie: 'cours_en_ligne',
    statut: 'en_evaluation',
    datesoumission: '2024-12-01',
    dateReception: '2025-03-05',
    evaluationStatut: 'non_evalue',
    joursEnAttente: 4,
  },
  {
    id: 'D-2025-003',
    titre: 'Analyse mathématique — Tome II',
    categorie: 'ouvrage',
    statut: 'accepte',
    datesoumission: '2025-02-10',
    dateReception: '2025-02-15',
    evaluationStatut: 'evalue',
    joursEnAttente: 0,
  },
  {
    id: 'D-2025-004',
    titre: 'Réseaux de neurones convolutifs pour la vision par ordinateur',
    categorie: 'publication',
    statut: 'corrections',
    datesoumission: '2025-01-25',
    dateReception: '2025-02-01',
    evaluationStatut: 'evalue',
    joursEnAttente: 0,
  },
  {
    id: 'D-2025-006',
    titre: 'Deep Learning pour le traitement du langage naturel',
    categorie: 'publication',
    statut: 'accepte',
    datesoumission: '2024-12-15',
    dateReception: '2025-01-10',
    evaluationStatut: 'evalue',
    joursEnAttente: 0,
  },
  {
    id: 'D-2025-008',
    titre: 'Manuel de génie logiciel — Édition 2025',
    categorie: 'ouvrage',
    statut: 'en_evaluation',
    datesoumission: '2025-03-01',
    dateReception: '2025-03-06',
    evaluationStatut: 'non_evalue',
    joursEnAttente: 3,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyFilters(
  dossiers: DossierAssigne[],
  filters: DossiersAssignesFilters
): DossierAssigne[] {
  const {
    search = '',
    evaluationStatut = 'tous',
    categorie = 'tous',
  } = filters

  return dossiers.filter((d) => {
    const matchSearch =
      d.titre.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase())
    const matchStatut =
      evaluationStatut === 'tous' || d.evaluationStatut === evaluationStatut
    const matchCategorie =
      categorie === 'tous' || d.categorie === categorie
    return matchSearch && matchStatut && matchCategorie
  })
}

export function computeDossiersStats(
  dossiers: DossierAssigne[]
): DossiersAssignesStats {
  return {
    total: dossiers.length,
    nonEvalues: dossiers.filter((d) => d.evaluationStatut === 'non_evalue').length,
    enCours: dossiers.filter((d) => d.evaluationStatut === 'en_cours').length,
    evalues: dossiers.filter((d) => d.evaluationStatut === 'evalue').length,
  }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const dossiersAssignesService = {

  /**
   * Fetch paginated & filtered dossiers assigned to the logged-in CSD member.
   * Backend endpoint: GET /csd/dossiers
   */
  getDossiersAssignes: async (
    filters: DossiersAssignesFilters = {}
  ): Promise<{ data: DossierAssigne[]; total: number; totalPages: number }> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    const { page = 1, pageSize = 6 } = filters
    const filtered = applyFilters(MOCK_DOSSIERS, filters)
    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const data = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { data, total, totalPages }
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get('/csd/dossiers', { params: filters })
    // return response.data
  },

  /**
   * Fetch stats for all assigned dossiers (unfiltered).
   * Backend endpoint: GET /csd/dossiers/stats
   */
  getStats: async (): Promise<DossiersAssignesStats> => {
    // ── MOCK ─────────────────────────────────────────────────────────────────
    return computeDossiersStats(MOCK_DOSSIERS)
    // ── END MOCK ─────────────────────────────────────────────────────────────

    // ── REAL API ─────────────────────────────────────────────────────────────
    // const response = await api.get<DossiersAssignesStats>('/csd/dossiers/stats')
    // return response.data
  },
}

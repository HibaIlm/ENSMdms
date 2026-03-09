// ── Enums ─────────────────────────────────────────────────────────────────────

export type Role = 'directrice' | 'enseignant' | 'csd'
export type CSDRole = 'consultation' | 'validation'
export type Statut =
  | 'soumis'
  | 'en_evaluation'
  | 'accepte'
  | 'refuse'
  | 'corrections'
  | 'decision_communiquee'
export type Categorie = 'cours_en_ligne' | 'publication' | 'ouvrage'

// ── Entities ──────────────────────────────────────────────────────────────────

export interface User {
  id: string
  nom: string
  prenom: string
  email: string
  role: Role
  // Optional fields present only for specific roles.
  // csdRole is set when role === 'csd'
  // departement is set for enseignant and csd roles
  csdRole?: CSDRole
  departement?: string
}

export interface Enseignant extends User {
  role: 'enseignant'
  grade: string
  departement: string
  telephone?: string
  specialite?: string
  actif: boolean
}

export interface MembreCSD extends User {
  role: 'csd'
  csdRole: CSDRole
  departement: string
  csd: 1 | 2
}

export interface Dossier {
  id: string
  titre: string
  categorie: Categorie
  statut: Statut
  datesoumission: string
  dateDecision?: string
  enseignant?: Enseignant
  csdAssigne?: 1 | 2
  fichierUrl?: string
  description?: string
}

export interface Evaluation {
  id: string
  dossierId: string
  membreCSD: MembreCSD
  decision: 'accepte' | 'refuse' | 'corrections'
  commentaire?: string
  dateEvaluation: string
}

export interface Message {
  id: string
  contenu: string
  dateEnvoi: string
  expediteur: User
  destinataire: User
  dossierId?: string
  lu: boolean
}

// ── API Response wrappers ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}
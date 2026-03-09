import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Bell,
  Monitor,
  BookOpen,
} from 'lucide-react'
import type { Statut, Categorie } from '../types'

// ── Statut display config ─────────────────────────────────────────────────────
// Single source of truth for how each statut looks across the entire app.
// To add a new statut: add it to the Statut type in types/index.ts, then add
// its config here. No other file needs to change.

export const STATUT_CONFIG: Record<
  Statut,
  {
    label: string
    color: string
    bg: string
    icon: typeof CheckCircle2
  }
> = {
  soumis: {
    label: 'Soumis',
    color: 'var(--color-status-soumis)',
    bg: '#F3F4F6',
    icon: FileText,
  },
  en_evaluation: {
    label: 'En évaluation',
    color: 'var(--color-status-evaluation)',
    bg: '#FFF7ED',
    icon: Clock,
  },
  accepte: {
    label: 'Accepté',
    color: 'var(--color-status-accepte)',
    bg: '#F0FDF4',
    icon: CheckCircle2,
  },
  refuse: {
    label: 'Refusé',
    color: 'var(--color-status-refuse)',
    bg: '#FEF2F2',
    icon: XCircle,
  },
  corrections: {
    label: 'Corrections demandées',
    color: 'var(--color-status-corrections)',
    bg: '#FEFCE8',
    icon: RefreshCw,
  },
  decision_communiquee: {
    label: 'Décision communiquée',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    icon: Bell,
  },
}

// ── Categorie display config ──────────────────────────────────────────────────

export const CATEGORIE_CONFIG: Record<
  Categorie,
  {
    label: string
    color: string
    icon: typeof Monitor
  }
> = {
  cours_en_ligne: {
    label: 'Cours en ligne',
    color: '#0EA5E9',
    icon: Monitor,
  },
  publication: {
    label: 'Publication',
    color: '#8B5CF6',
    icon: FileText,
  },
  ouvrage: {
    label: 'Ouvrage',
    color: '#F97316',
    icon: BookOpen,
  },
}

// ── Pagination ────────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 5

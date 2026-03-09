import { useNavigate } from 'react-router-dom'
import {
  Search, FolderOpen, Clock, CheckCircle2,
  ChevronRight, ChevronLeft, AlertCircle, Loader2,
  RefreshCw, SlidersHorizontal, X, Calendar, Layers,
} from 'lucide-react'
import NavbarCSD from '../../components/NavbarCSD'
import { useDossiersAssignes } from '../../hooks/useDossiersAssignes'
import { useAuth } from '../../hooks/useAuth'
import { CATEGORIE_CONFIG } from '../../constants/dossierConfig'
import type { DossierAssigne, EvaluationStatut } from '../../services/dossiersAssignesService'
import type { Categorie, CSDRole } from '../../types'

// ── Evaluation statut config ──────────────────────────────────────────────────
// Single source of truth for evaluation statut labels, colors and icons.
// Mirrors the pattern of STATUT_CONFIG used elsewhere in the project.

export const EVALUATION_STATUT_CONFIG: Record<
  EvaluationStatut,
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  non_evalue: {
    label: 'Non évalué',
    color: 'var(--color-status-soumis)',
    bg: 'var(--color-eval-non-evalue-bg)',
    icon: Clock,
  },
  en_cours: {
    label: 'En cours',
    color: 'var(--color-status-evaluation)',
    bg: 'var(--color-eval-en-cours-bg)',
    icon: SlidersHorizontal,
  },
  evalue: {
    label: 'Évalué',
    color: 'var(--color-status-accepte)',
    bg: 'var(--color-eval-evalue-bg)',
    icon: CheckCircle2,
  },
}

// ── Filter options ────────────────────────────────────────────────────────────

const EVALUATION_STATUT_OPTIONS: { value: EvaluationStatut | 'tous'; label: string }[] = [
  { value: 'tous', label: 'Tous les statuts' },
  { value: 'non_evalue', label: 'Non évalué' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'evalue', label: 'Évalué' },
]

const CATEGORIE_OPTIONS: { value: Categorie | 'tous'; label: string }[] = [
  { value: 'tous', label: 'Toutes catégories' },
  { value: 'cours_en_ligne', label: 'Cours en ligne' },
  { value: 'publication', label: 'Publication' },
  { value: 'ouvrage', label: 'Ouvrage' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function DossiersAssignes() {
  const navigate = useNavigate()
  const { user, fullName } = useAuth()
  const csdRole: CSDRole = user?.csdRole ?? 'consultation'

  const {
    dossiers,
    stats,
    totalPages,
    total,
    isLoading,
    error,
    filters,
    hasActiveFilters,
    pageSize,
    setSearch,
    setEvaluationStatut,
    setCategorie,
    setPage,
    resetFilters,
    refresh,
  } = useDossiersAssignes()

  return (
    <div className="min-h-screen bg-page-csd">
      <NavbarCSD
        nomMembre={fullName}
        role={csdRole}
        departement="Management et Entrepreneuriat"
        onLogout={() => navigate('/login')}
      />

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8 space-y-6">

        <PageHeader />

        {stats && <StatsBar stats={stats} />}

        <FiltersBar
          search={filters.search}
          evaluationStatut={filters.evaluationStatut}
          categorie={filters.categorie}
          hasActiveFilters={hasActiveFilters}
          onSearch={setSearch}
          onEvaluationStatut={setEvaluationStatut}
          onCategorie={setCategorie}
          onReset={resetFilters}
        />

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : dossiers.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
        ) : (
          <>
            <ResultsHeader total={total} page={filters.page} pageSize={pageSize} />
            <DossiersList
              dossiers={dossiers}
              onSelect={(id) => navigate(`/csd/dossiers/${id}`)}
            />
            {totalPages > 1 && (
              <Pagination
                page={filters.page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}

      </main>
    </div>
  )
}

// ── Page Header ───────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Dossiers assignés</h1>
      <p className="text-gray-400 text-sm mt-1">
        Consultez et évaluez les dossiers qui vous ont été transmis par la Directrice.
      </p>
    </div>
  )
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({
  stats,
}: {
  stats: { total: number; nonEvalues: number; enCours: number; evalues: number }
}) {
  const items = [
    { label: 'Total', value: stats.total, color: 'var(--color-csd)', icon: <Layers size={14} /> },
    { label: 'Non évalués', value: stats.nonEvalues, color: 'var(--color-status-soumis)', icon: <Clock size={14} /> },
    { label: 'En cours', value: stats.enCours, color: 'var(--color-status-evaluation)', icon: <SlidersHorizontal size={14} /> },
    { label: 'Évalués', value: stats.evalues, color: 'var(--color-status-accepte)', icon: <CheckCircle2 size={14} /> },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ label, value, color, icon }) => (
        <div
          key={label}
          className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <div>
            <p className="text-lg font-black text-gray-800">{value}</p>
            <p className="text-[10px] text-gray-400">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Filters Bar ───────────────────────────────────────────────────────────────

function FiltersBar({
  search,
  evaluationStatut,
  categorie,
  hasActiveFilters,
  onSearch,
  onEvaluationStatut,
  onCategorie,
  onReset,
}: {
  search: string
  evaluationStatut: EvaluationStatut | 'tous'
  categorie: Categorie | 'tous'
  hasActiveFilters: boolean
  onSearch: (v: string) => void
  onEvaluationStatut: (v: EvaluationStatut | 'tous') => void
  onCategorie: (v: Categorie | 'tous') => void
  onReset: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Rechercher par titre ou numéro..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-csd focus:ring-2 focus:ring-csd/10 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Evaluation statut filter */}
        <select
          value={evaluationStatut}
          onChange={(e) => onEvaluationStatut(e.target.value as EvaluationStatut | 'tous')}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-csd focus:ring-2 focus:ring-csd/10 transition-all appearance-none cursor-pointer"
        >
          {EVALUATION_STATUT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Categorie filter */}
        <select
          value={categorie}
          onChange={(e) => onCategorie(e.target.value as Categorie | 'tous')}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-csd focus:ring-2 focus:ring-csd/10 transition-all appearance-none cursor-pointer"
        >
          {CATEGORIE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <X size={14} />
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}

// ── Results Header ────────────────────────────────────────────────────────────

function ResultsHeader({
  total,
  page,
  pageSize,
}: {
  total: number
  page: number
  pageSize: number
}) {
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <p className="text-sm text-gray-400">
      Affichage de <span className="font-semibold text-gray-600">{from}–{to}</span> sur{' '}
      <span className="font-semibold text-gray-600">{total}</span> dossier{total > 1 ? 's' : ''}
    </p>
  )
}

// ── Dossiers List ─────────────────────────────────────────────────────────────

function DossiersList({
  dossiers,
  onSelect,
}: {
  dossiers: DossierAssigne[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {dossiers.map((dossier) => (
        <DossierRow key={dossier.id} dossier={dossier} onClick={() => onSelect(dossier.id)} />
      ))}
    </div>
  )
}

function DossierRow({
  dossier,
  onClick,
}: {
  dossier: DossierAssigne
  onClick: () => void
}) {
  const evalConfig = EVALUATION_STATUT_CONFIG[dossier.evaluationStatut]
  const EvalIcon = evalConfig.icon
  const categorie = CATEGORIE_CONFIG[dossier.categorie]
  const CategorieIcon = categorie.icon

  const urgencyColor =
    dossier.joursEnAttente >= 7 ? 'var(--color-status-refuse)'
    : dossier.joursEnAttente >= 4 ? 'var(--color-status-evaluation)'
    : dossier.joursEnAttente > 0 ? 'var(--color-status-corrections)'
    : null

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-csd/30 cursor-pointer transition-all duration-150 group"
    >

      {/* Evaluation statut icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
        style={{ backgroundColor: evalConfig.bg }}
      >
        <EvalIcon size={18} style={{ color: evalConfig.color }} />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[10px] font-mono text-gray-300">{dossier.id}</span>
          {urgencyColor && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ color: urgencyColor, backgroundColor: `${urgencyColor}15` }}
            >
              {dossier.joursEnAttente}j en attente
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-csd transition-colors">
          {dossier.titre}
        </p>

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ color: categorie.color, backgroundColor: `${categorie.color}15` }}
          >
            <CategorieIcon size={9} />
            {categorie.label}
          </span>
          <span className="text-[10px] text-gray-300 flex items-center gap-1">
            <Calendar size={9} />
            Reçu le {new Date(dossier.dateReception).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      {/* Evaluation statut badge */}
      <div className="shrink-0 hidden sm:flex items-center gap-2">
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-xl"
          style={{ color: evalConfig.color, backgroundColor: evalConfig.bg }}
        >
          {evalConfig.label}
        </span>
      </div>

      <ChevronRight
        size={16}
        className="text-gray-200 group-hover:text-csd transition-colors shrink-0"
      />
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  // Show up to 5 page numbers centered around current page
  const getPageNumbers = (): number[] => {
    const delta = 2
    const range: number[] = []
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i)
    }
    return range
  }

  return (
    <div className="flex items-center justify-center gap-2">

      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={14} />
        Précédent
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
            style={
              p === page
                ? { backgroundColor: 'var(--color-csd)', color: 'white' }
                : { color: '#6B7280' }
            }
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Suivant
        <ChevronRight size={14} />
      </button>

    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean
  onReset: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 flex flex-col items-center text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-csd/10 flex items-center justify-center mb-4">
        <FolderOpen size={24} className="text-csd" />
      </div>
      <p className="font-semibold text-gray-700 mb-1">
        {hasFilters ? 'Aucun résultat' : 'Aucun dossier assigné'}
      </p>
      <p className="text-sm text-gray-400 max-w-xs">
        {hasFilters
          ? 'Aucun dossier ne correspond à vos filtres. Essayez de les modifier.'
          : 'La Directrice ne vous a pas encore assigné de dossiers.'}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-csd border border-csd/30 hover:bg-csd/5 transition-colors"
        >
          <X size={14} />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  )
}

// ── Loading & Error states ────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={28} className="text-csd animate-spin" />
      <p className="text-sm text-gray-400">Chargement des dossiers...</p>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
        <AlertCircle size={20} className="text-red-400" />
      </div>
      <p className="font-semibold text-gray-700 mb-1">Erreur de chargement</p>
      <p className="text-sm text-gray-400 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-csd hover:opacity-90 transition-opacity"
      >
        <RefreshCw size={14} />
        Réessayer
      </button>
    </div>
  )
}
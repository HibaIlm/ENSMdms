import { useNavigate } from 'react-router-dom'
import {
  FolderOpen,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Plus,
  SlidersHorizontal,
  X,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'
import NavbarEnseignant from '../../components/NavbarEnseignant'
import { useMesDossiers } from '../../hooks/useMesDossiers'
import { STATUT_CONFIG, CATEGORIE_CONFIG } from '../../constants/dossierConfig'
import type { Statut, Categorie, Dossier } from '../../types'

// ── Component ─────────────────────────────────────────────────────────────────

export default function MesDossiers() {
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)

  const {
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
  } = useMesDossiers()

  const hasActiveFilters =
    filterStatut !== 'tous' || filterCategorie !== 'tous' || search !== ''

  return (
    <div className="min-h-screen bg-[#F0F7F9]">
      <NavbarEnseignant nomEnseignant="Dr. Meziane Karim" />

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8 space-y-6">

        <Header
          total={stats.total}
          onNewDossier={() => navigate('/ens/depot/nouveau')}
        />

        <StatusPills
          stats={stats}
          activeStatut={filterStatut}
          onSelect={setFilterStatut}
        />

        <SearchBar
          search={search}
          filterCategorie={filterCategorie}
          hasActiveFilters={hasActiveFilters}
          showFilters={showFilters}
          onSearch={setSearch}
          onFilterCategorie={setFilterCategorie}
          onToggleFilters={() => setShowFilters((v) => !v)}
          onClearFilters={clearFilters}
        />

        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <DossierTable
            dossiers={dossiers}
            total={total}
            hasActiveFilters={hasActiveFilters}
            onRowClick={(id) => navigate(`/ens/dossiers/${id}`)}
            onNewDossier={() => navigate('/ens/depot/nouveau')}
            onClearFilters={clearFilters}
          />
        )}

        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={setCurrentPage}
          />
        )}

      </main>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({
  total,
  onNewDossier,
}: {
  total: number
  onNewDossier: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes Dossiers</h1>
        <p className="text-gray-400 text-sm mt-1">
          {total} dossier{total > 1 ? 's' : ''} au total
        </p>
      </div>
      <button
        onClick={onNewDossier}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold bg-enseignant hover:opacity-90 transition-opacity shadow-sm"
      >
        <Plus size={16} />
        Nouveau dépôt
      </button>
    </div>
  )
}

// ── Status Pills ──────────────────────────────────────────────────────────────

interface StatsShape {
  total: number
  soumis: number
  en_evaluation: number
  accepte: number
  refuse: number
  corrections: number
}

interface StatusPillsProps {
  stats: StatsShape
  activeStatut: Statut | 'tous'
  onSelect: (val: Statut | 'tous') => void
}

const STATUS_PILLS: Array<{
  key: Statut | 'tous'
  label: string
  statsKey: keyof StatsShape
}> = [
  { key: 'tous', label: 'Tous', statsKey: 'total' },
  { key: 'soumis', label: 'Soumis', statsKey: 'soumis' },
  { key: 'en_evaluation', label: 'En évaluation', statsKey: 'en_evaluation' },
  { key: 'accepte', label: 'Acceptés', statsKey: 'accepte' },
  { key: 'corrections', label: 'Corrections', statsKey: 'corrections' },
  { key: 'refuse', label: 'Refusés', statsKey: 'refuse' },
]

function StatusPills({ stats, activeStatut, onSelect }: StatusPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_PILLS.map(({ key, label, statsKey }) => {
        const isActive = activeStatut === key
        const color =
          key === 'tous'
            ? 'var(--color-enseignant)'
            : STATUT_CONFIG[key as Statut]?.color ?? '#6B7280'

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150"
            style={
              isActive
                ? { backgroundColor: color, color: '#fff', borderColor: color }
                : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }
            }
          >
            {label}
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={
                isActive
                  ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#6B7280' }
              }
            >
              {stats[statsKey]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Search Bar ────────────────────────────────────────────────────────────────

interface SearchBarProps {
  search: string
  filterCategorie: Categorie | 'tous'
  hasActiveFilters: boolean
  showFilters: boolean
  onSearch: (val: string) => void
  onFilterCategorie: (val: Categorie | 'tous') => void
  onToggleFilters: () => void
  onClearFilters: () => void
}

function SearchBar({
  search,
  filterCategorie,
  hasActiveFilters,
  showFilters,
  onSearch,
  onFilterCategorie,
  onToggleFilters,
  onClearFilters,
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex gap-3 flex-wrap">

        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Rechercher par titre ou numéro..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-enseignant focus:ring-2 focus:ring-enseignant/10 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all sm:hidden
            ${showFilters
              ? 'border-enseignant text-enseignant bg-enseignant/5'
              : 'border-gray-200 text-gray-500'
            }`}
        >
          <SlidersHorizontal size={14} />
          Filtres
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Filter size={14} className="text-gray-300 shrink-0" />
          <CategorySelect value={filterCategorie} onChange={onFilterCategorie} />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
          >
            <X size={13} />
            Réinitialiser
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 sm:hidden">
          <CategorySelect value={filterCategorie} onChange={onFilterCategorie} fullWidth />
        </div>
      )}
    </div>
  )
}

// ── Category Select ───────────────────────────────────────────────────────────

function CategorySelect({
  value,
  onChange,
  fullWidth = false,
}: {
  value: Categorie | 'tous'
  onChange: (val: Categorie | 'tous') => void
  fullWidth?: boolean
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Categorie | 'tous')}
      className={`${fullWidth ? 'w-full' : ''} px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-enseignant appearance-none cursor-pointer text-gray-600`}
    >
      <option value="tous">Toutes catégories</option>
      {(Object.keys(CATEGORIE_CONFIG) as Categorie[]).map((key) => (
        <option key={key} value={key}>
          {CATEGORIE_CONFIG[key].label}
        </option>
      ))}
    </select>
  )
}

// ── Dossier Table ─────────────────────────────────────────────────────────────

interface DossierTableProps {
  dossiers: Dossier[]
  total: number
  hasActiveFilters: boolean
  onRowClick: (id: string) => void
  onNewDossier: () => void
  onClearFilters: () => void
}

function DossierTable({
  dossiers,
  total,
  hasActiveFilters,
  onRowClick,
  onNewDossier,
  onClearFilters,
}: DossierTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {total} résultat{total > 1 ? 's' : ''}
          {hasActiveFilters && ' — filtres actifs'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-medium text-enseignant hover:underline"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {dossiers.length === 0 ? (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onNewDossier={onNewDossier}
          onClearFilters={onClearFilters}
        />
      ) : (
        <>
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <div className="col-span-5">Titre</div>
            <div className="col-span-2">Catégorie</div>
            <div className="col-span-2">Date soumission</div>
            <div className="col-span-2">Statut</div>
            <div className="col-span-1" />
          </div>

          <div className="divide-y divide-gray-50">
            {dossiers.map((dossier) => (
              <DossierRow
                key={dossier.id}
                dossier={dossier}
                onClick={() => onRowClick(dossier.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Dossier Row ───────────────────────────────────────────────────────────────

function DossierRow({ dossier, onClick }: { dossier: Dossier; onClick: () => void }) {
  const statut = STATUT_CONFIG[dossier.statut]
  const StatutIcon = statut.icon
  const categorie = CATEGORIE_CONFIG[dossier.categorie]
  const CategorieIcon = categorie.icon

  return (
    <div
      onClick={onClick}
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
    >
      <div className="md:col-span-5 flex flex-col justify-center min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-enseignant transition-colors">
          {dossier.titre}
        </p>
        <p className="text-xs text-gray-300 mt-0.5">{dossier.id}</p>
      </div>

      <div className="md:col-span-2 flex items-center">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full"
          style={{ color: categorie.color, backgroundColor: `${categorie.color}15` }}
        >
          <CategorieIcon size={10} />
          {categorie.label}
        </span>
      </div>

      <div className="md:col-span-2 flex items-center">
        <span className="text-xs text-gray-400 flex items-center gap-1.5">
          <Calendar size={11} className="text-gray-300" />
          {new Date(dossier.datesoumission).toLocaleDateString('fr-FR')}
        </span>
      </div>

      <div className="md:col-span-2 flex items-center">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full"
          style={{ color: statut.color, backgroundColor: statut.bg }}
        >
          <StatutIcon size={10} />
          {statut.label}
        </span>
      </div>

      <div className="hidden md:flex md:col-span-1 items-center justify-end">
        <ChevronRight size={15} className="text-gray-200 group-hover:text-enseignant transition-colors" />
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({
  hasActiveFilters,
  onNewDossier,
  onClearFilters,
}: {
  hasActiveFilters: boolean
  onNewDossier: () => void
  onClearFilters: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-enseignant/10 flex items-center justify-center mb-4">
        <FolderOpen size={28} className="text-enseignant" />
      </div>
      <p className="font-semibold text-gray-700 mb-1">Aucun dossier trouvé</p>
      <p className="text-sm text-gray-400 mb-4">
        {hasActiveFilters
          ? 'Essayez de modifier vos filtres de recherche.'
          : "Vous n'avez pas encore soumis de dossier."}
      </p>
      {hasActiveFilters ? (
        <button onClick={onClearFilters} className="text-sm font-semibold text-enseignant hover:underline">
          Réinitialiser les filtres
        </button>
      ) : (
        <button
          onClick={onNewDossier}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold bg-enseignant hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Soumettre un dossier
        </button>
      )}
    </div>
  )
}

// ── Loading State ─────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="text-enseignant animate-spin" />
        <p className="text-sm text-gray-400">Chargement des dossiers...</p>
      </div>
    </div>
  )
}

// ── Error State ───────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <p className="font-semibold text-gray-700 mb-1">Une erreur est survenue</p>
      <p className="text-sm text-gray-400 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold bg-enseignant hover:opacity-90 transition-opacity"
      >
        <RefreshCw size={14} />
        Réessayer
      </button>
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400">
        Page {currentPage} sur {totalPages} — {total} résultat{total > 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-enseignant hover:text-enseignant disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-8 h-8 rounded-lg text-xs font-semibold border transition-all"
            style={
              currentPage === page
                ? { backgroundColor: 'var(--color-enseignant)', color: '#fff', borderColor: 'var(--color-enseignant)' }
                : {}
            }
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-enseignant hover:text-enseignant disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
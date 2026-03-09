import { useNavigate } from 'react-router-dom'
import {
  FolderOpen,
  Clock,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  AlertTriangle,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react'
import NavbarCSD from '../../components/NavbarCSD'
import { useCSDDashboard } from '../../hooks/useCSDDashboard'
import { useAuth } from '../../hooks/useAuth'
import { STATUT_CONFIG, CATEGORIE_CONFIG } from '../../constants/dossierConfig'
import type { CSDDashboardStats, DossierUrgent } from '../../services/csdDashboardService'
import type { CSDRole } from '../../types'

// ── Stat card config ──────────────────────────────────────────────────────────
// Single source of truth for dashboard stat cards.
// To add a new stat: add it here and to CSDDashboardStats in the service.

interface StatCardConfig {
  label: string
  statsKey: keyof CSDDashboardStats
  color: string
  icon: typeof FolderOpen
  navigateTo: string
}

const STAT_CARDS: StatCardConfig[] = [
  {
    label: 'Total assignés',
    statsKey: 'totalAssignes',
    color: 'var(--color-csd)',
    icon: Layers,
    navigateTo: '/csd/dossiers',
  },
  {
    label: 'Non évalués',
    statsKey: 'nonEvalues',
    color: 'var(--color-status-evaluation)',
    icon: Clock,
    navigateTo: '/csd/dossiers',
  },
  {
    label: 'Évalués',
    statsKey: 'evalues',
    color: 'var(--color-status-accepte)',
    icon: CheckCircle2,
    navigateTo: '/csd/dossiers',
  },
  {
    label: 'Messages non lus',
    statsKey: 'messagesNonLus',
    color: '#0EA5E9',
    icon: MessageSquare,
    navigateTo: '/csd/messages',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function CSDDashboard() {
  const navigate = useNavigate()
  const { user, fullName } = useAuth()

  const { stats, dossiersUrgents, isLoading, error, refresh } = useCSDDashboard()

  // Derive CSD role from user — fallback to consultation
  // When backend is ready, this comes directly from the user object
  const csdRole: CSDRole = user?.csdRole ?? 'consultation'

  if (isLoading) return <LoadingScreen />
  if (error || !stats) return <ErrorScreen message={error ?? 'Erreur inconnue'} onRetry={refresh} />

  return (
    <div className="min-h-screen bg-page-csd">
      <NavbarCSD
        nomMembre={fullName}
        role={csdRole}
        departement="Management et Entrepreneuriat"
        messagesNonLus={stats.messagesNonLus}
        dossiersNonTraites={stats.nonEvalues}
        onLogout={() => navigate('/login')}
      />

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8 space-y-6">

        <DashboardHeader fullName={fullName} role={csdRole} />

        <StatsCards stats={stats} onNavigate={navigate} />

        <ProgressSection stats={stats} />

        <UrgentsSection
          dossiers={dossiersUrgents}
          onNavigate={navigate}
        />

      </main>
    </div>
  )
}

// ── Dashboard Header ──────────────────────────────────────────────────────────

function DashboardHeader({
  fullName,
  role,
}: {
  fullName: string
  role: CSDRole
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Bonjour, {fullName || 'Membre CSD'} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Role reminder */}
      <RoleBadge role={role} />
    </div>
  )
}

function RoleBadge({ role }: { role: CSDRole }) {
  const isValidation = role === 'validation'
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold self-start sm:self-auto ${
        isValidation
          ? 'bg-csd-role-validation-bg text-csd-role-validation-text'
          : 'bg-csd-role-consultation-bg text-csd-role-consultation-text'
      }`}
    >
      {isValidation ? <CheckCircle2 size={15} /> : <Clock size={15} />}
      Rôle : {isValidation ? 'Validation' : 'Consultation'}
    </div>
  )
}

// ── Stats Cards ───────────────────────────────────────────────────────────────

function StatsCards({
  stats,
  onNavigate,
}: {
  stats: CSDDashboardStats
  onNavigate: (path: string) => void
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={stats[card.statsKey]}
          color={card.color}
          icon={<card.icon size={20} />}
          onClick={() => onNavigate(card.navigateTo)}
        />
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
  icon,
  onClick,
}: {
  label: string
  value: number
  color: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left hover:shadow-md transition-all duration-150 group w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        <ChevronRight size={14} className="text-gray-200 group-hover:text-gray-400 mt-1" />
      </div>
      <p className="text-3xl font-black text-gray-800">{value}</p>
      <p className="text-xs text-gray-400 mt-1 leading-tight">{label}</p>
    </button>
  )
}

// ── Progress Section ──────────────────────────────────────────────────────────

function ProgressSection({ stats }: { stats: CSDDashboardStats }) {
  const progressPercent = stats.totalAssignes > 0
    ? Math.round((stats.evalues / stats.totalAssignes) * 100)
    : 0

  const segments = [
    { label: 'Évalués', value: stats.evalues, color: 'var(--color-status-accepte)' },
    { label: 'En cours', value: stats.enCours, color: 'var(--color-status-evaluation)' },
    { label: 'Non évalués', value: stats.nonEvalues, color: '#E5E7EB' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Progression globale</h2>
        <span className="text-2xl font-black text-csd">{progressPercent}%</span>
      </div>

      {/* Segmented progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex mb-4">
        {stats.totalAssignes > 0 && segments
          .filter((s) => s.value > 0)
          .map(({ label, value, color }) => (
            <div
              key={label}
              className="h-full transition-all duration-700"
              style={{
                width: `${(value / stats.totalAssignes) * 100}%`,
                backgroundColor: color,
              }}
            />
          ))
        }
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {segments.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-bold text-gray-700">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Urgents Section ───────────────────────────────────────────────────────────

function UrgentsSection({
  dossiers,
  onNavigate,
}: {
  dossiers: DossierUrgent[]
  onNavigate: (path: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle size={16} className="text-status-evaluation" />
          Dossiers à traiter
        </h2>
        <button
          onClick={() => onNavigate('/csd/dossiers')}
          className="flex items-center gap-1 text-xs font-medium text-csd hover:underline"
        >
          Voir tout <ArrowRight size={12} />
        </button>
      </div>

      {dossiers.length === 0 ? (
        <EmptyUrgents />
      ) : (
        <div className="divide-y divide-gray-50">
          {dossiers.map((dossier) => (
            <UrgentDossierRow
              key={dossier.id}
              dossier={dossier}
              onClick={() => onNavigate(`/csd/dossiers/${dossier.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function UrgentDossierRow({
  dossier,
  onClick,
}: {
  dossier: DossierUrgent
  onClick: () => void
}) {
  const statut = STATUT_CONFIG[dossier.statut]
  const StatutIcon = statut.icon
  const categorie = CATEGORIE_CONFIG[dossier.categorie]
  const CategorieIcon = categorie.icon

  // Urgency color based on days waiting
  const urgencyColor =
    dossier.joursDepuisReception >= 7 ? 'var(--color-status-refuse)'
    : dossier.joursDepuisReception >= 4 ? 'var(--color-status-evaluation)'
    : 'var(--color-status-corrections)'

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
    >
      {/* Status icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: statut.bg }}
      >
        <StatutIcon size={15} style={{ color: statut.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-csd transition-colors">
          {dossier.titre}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ color: categorie.color, backgroundColor: `${categorie.color}15` }}
          >
            <CategorieIcon size={9} />
            {categorie.label}
          </span>
          <span className="text-[10px] text-gray-300 flex items-center gap-1">
            <Calendar size={9} />
            {new Date(dossier.datesoumission).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      {/* Days waiting badge */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-lg"
          style={{ color: urgencyColor, backgroundColor: `${urgencyColor}15` }}
        >
          {dossier.joursDepuisReception}j en attente
        </span>
      </div>

      <ChevronRight size={14} className="text-gray-200 group-hover:text-csd transition-colors shrink-0" />
    </div>
  )
}

function EmptyUrgents() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-csd/10 flex items-center justify-center mb-3">
        <CheckCircle2 size={24} className="text-csd" />
      </div>
      <p className="font-semibold text-gray-700 mb-1">Tout est à jour !</p>
      <p className="text-sm text-gray-400">Aucun dossier en attente de traitement.</p>
    </div>
  )
}

// ── Loading & Error screens ───────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-page-csd flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-csd animate-spin" />
        <p className="text-sm text-gray-400">Chargement du tableau de bord...</p>
      </div>
    </div>
  )
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-page-csd flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <p className="font-semibold text-gray-700 mb-1">Erreur de chargement</p>
        <p className="text-sm text-gray-400 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold bg-csd hover:opacity-90 transition-opacity mx-auto"
        >
          <RefreshCw size={14} />
          Réessayer
        </button>
      </div>
    </div>
  )
}
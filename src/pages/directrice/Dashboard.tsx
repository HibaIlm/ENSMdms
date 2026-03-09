import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderOpen, Users, Clock, CheckCircle2, AlertCircle,
  ArrowRight, TrendingUp, Bell, RefreshCw, FileText, Shield,
  ChevronRight, BarChart3, Calendar, Layers, Loader2,
} from 'lucide-react'
import NavbarDirectrice from '../../components/NavbarDirectrice'
import { useDashboard } from '../../hooks/useDashboard'
import { STATUT_CONFIG, CATEGORIE_CONFIG } from '../../constants/dossierConfig'
import type { Dossier } from '../../types'
import type { ActiviteCSD, DistributionStat, CategoryStat, DashboardStats } from '../../services/dashboardService'

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardDirectrice() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'apercu' | 'activite'>('apercu')

  const {
    stats,
    dossiersRecents,
    activiteCSD,
    distribution,
    categories,
    isLoading,
    error,
    refresh,
  } = useDashboard()

  if (isLoading) return <LoadingScreen />
  if (error || !stats) return <ErrorScreen message={error ?? 'Erreur inconnue'} onRetry={refresh} />

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <NavbarDirectrice
        nomDirectrice="Dr. Mohamed El Hadj Leila"
        messagesNonLus={stats.messagesNonLus}
        comptesEnAttente={stats.comptesEnAttente}
        onLogout={() => navigate('/login')}
        onSwitchToEnseignante={() => navigate('/ens/dashboard')}
      />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        <DashboardHeader stats={stats} onNavigate={navigate} />

        <StatsCards stats={stats} onNavigate={navigate} />

        <QuickActions stats={stats} onNavigate={navigate} />

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'apercu' ? (
          <ApercuTab
            dossiersRecents={dossiersRecents}
            distribution={distribution}
            categories={categories}
            comptesEnAttente={stats.comptesEnAttente}
            totalDossiers={stats.totalDossiers}
            onNavigate={navigate}
          />
        ) : (
          <ActiviteTab activiteCSD={activiteCSD} onNavigate={navigate} />
        )}

      </main>
    </div>
  )
}

// ── Dashboard Header ──────────────────────────────────────────────────────────

function DashboardHeader({
  stats,
  onNavigate,
}: {
  stats: DashboardStats
  onNavigate: (path: string) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bonjour, Dr. Mohamed El Hadj Leila 👋</h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {stats.comptesEnAttente > 0 && (
          <AlertPill
            icon={<Users size={13} />}
            label={`${stats.comptesEnAttente} compte${stats.comptesEnAttente > 1 ? 's' : ''} en attente`}
            color="orange"
            onClick={() => onNavigate('/admin/users')}
          />
        )}
        {stats.messagesNonLus > 0 && (
          <AlertPill
            icon={<Bell size={13} />}
            label={`${stats.messagesNonLus} message${stats.messagesNonLus > 1 ? 's' : ''} non lu${stats.messagesNonLus > 1 ? 's' : ''}`}
            color="blue"
            onClick={() => onNavigate('/admin/messages')}
          />
        )}
      </div>
    </div>
  )
}

function AlertPill({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  color: 'orange' | 'blue'
  onClick: () => void
}) {
  const styles = {
    orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${styles[color]}`}
    >
      {icon}
      {label}
      <ChevronRight size={12} />
    </button>
  )
}

// ── Stats Cards ───────────────────────────────────────────────────────────────

function StatsCards({
  stats,
  onNavigate,
}: {
  stats: DashboardStats
  onNavigate: (path: string) => void
}) {
  const cards = [
    { label: 'Total dossiers', value: stats.totalDossiers, icon: <FolderOpen size={20} />, color: 'var(--color-directrice)', trend: '+5 ce mois' },
    { label: 'En attente transfert', value: stats.enAttente, icon: <Clock size={20} />, color: 'var(--color-status-evaluation)', trend: 'À traiter' },
    { label: 'En évaluation CSD', value: stats.enEvaluation, icon: <Shield size={20} />, color: '#8B5CF6', trend: '2 CSD actifs' },
    { label: 'Décisions rendues', value: stats.decisionsRendues, icon: <CheckCircle2 size={20} />, color: 'var(--color-status-accepte)', trend: '70% du total' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} onClick={() => onNavigate('/admin/dossiers')} />
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
  trend,
  onClick,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  trend: string
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
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
      <p className="text-[10px] font-medium mt-2" style={{ color }}>{trend}</p>
    </button>
  )
}

// ── Quick Actions ─────────────────────────────────────────────────────────────

function QuickActions({
  stats,
  onNavigate,
}: {
  stats: DashboardStats
  onNavigate: (path: string) => void
}) {
  const actions = [
    { label: 'Voir tous les dossiers', icon: FolderOpen, to: '/admin/dossiers', color: 'var(--color-directrice)' },
    { label: 'Activer des comptes', icon: Users, to: '/admin/users', color: 'var(--color-status-evaluation)', badge: stats.comptesEnAttente },
    { label: 'Gérer les rôles CSD', icon: Shield, to: '/admin/csd-roles', color: '#8B5CF6' },
    { label: 'Messagerie', icon: Bell, to: '/admin/messages', color: '#0EA5E9', badge: stats.messagesNonLus },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map(({ label, icon: Icon, to, color, badge }) => (
        <button
          key={to}
          onClick={() => onNavigate(to)}
          className="relative flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-150 group"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon size={18} />
          </div>
          <span className="text-xs font-medium text-gray-600 text-center leading-tight">{label}</span>
          {badge && badge > 0 ? (
            <span className="absolute top-2 right-2 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ backgroundColor: color }}>
              {badge}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: 'apercu' | 'activite'
  onTabChange: (tab: 'apercu' | 'activite') => void
}) {
  return (
    <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
      {(['apercu', 'activite'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${activeTab === tab ? 'text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          style={activeTab === tab ? { backgroundColor: 'var(--color-directrice)' } : {}}
        >
          {tab === 'apercu' ? <><BarChart3 size={14} />Aperçu</> : <><Layers size={14} />Activité CSD</>}
        </button>
      ))}
    </div>
  )
}

// ── Apercu Tab ────────────────────────────────────────────────────────────────

function ApercuTab({
  dossiersRecents,
  distribution,
  categories,
  comptesEnAttente,
  totalDossiers,
  onNavigate,
}: {
  dossiersRecents: Dossier[]
  distribution: DistributionStat[]
  categories: CategoryStat[]
  comptesEnAttente: number
  totalDossiers: number
  onNavigate: (path: string) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Recent dossiers */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FolderOpen size={16} className="text-directrice" />
            Dossiers récents
          </h2>
          <button onClick={() => onNavigate('/admin/dossiers')} className="flex items-center gap-1 text-xs font-medium text-directrice hover:underline">
            Voir tout <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {dossiersRecents.map((d) => (
            <DossierRow key={d.id} dossier={d} onClick={() => onNavigate(`/admin/dossiers/${d.id}`)} />
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <DistributionCard distribution={distribution} totalDossiers={totalDossiers} />
        {comptesEnAttente > 0 && <PendingAccountsCard count={comptesEnAttente} onNavigate={onNavigate} />}
        <CategoriesCard categories={categories} />
      </div>

    </div>
  )
}

function DossierRow({ dossier, onClick }: { dossier: Dossier; onClick: () => void }) {
  const statut = STATUT_CONFIG[dossier.statut]
  const StatutIcon = statut.icon
  const categorie = CATEGORIE_CONFIG[dossier.categorie]

  return (
    <div onClick={onClick} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: statut.bg }}>
        <StatutIcon size={14} style={{ color: statut.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{dossier.titre}</p>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: categorie.color, backgroundColor: `${categorie.color}15` }}>
          {categorie.label}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: statut.color, backgroundColor: statut.bg }}>
          {statut.label}
        </span>
        <span className="text-[10px] text-gray-300 flex items-center gap-1">
          <Calendar size={9} />
          {new Date(dossier.datesoumission).toLocaleDateString('fr-FR')}
        </span>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400 shrink-0" />
    </div>
  )
}

function DistributionCard({ distribution, totalDossiers }: { distribution: DistributionStat[]; totalDossiers: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-directrice" />
        Distribution
      </h2>
      <div className="space-y-3">
        {distribution.map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-700">{value}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(value / totalDossiers) * 100}%`, backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PendingAccountsCard({ count, onNavigate }: { count: number; onNavigate: (path: string) => void }) {
  return (
    <div className="rounded-2xl p-5 border bg-orange-50 border-orange-100">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={16} className="text-orange-500" />
        <h3 className="font-semibold text-orange-700 text-sm">Comptes en attente</h3>
      </div>
      <p className="text-orange-600 text-xs leading-relaxed mb-3">
        {count} enseignant{count > 1 ? 's' : ''} attendent l'activation de leur compte.
      </p>
      <button onClick={() => onNavigate('/admin/users')} className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700">
        Activer maintenant <ArrowRight size={12} />
      </button>
    </div>
  )
}

function CategoriesCard({ categories }: { categories: CategoryStat[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <FileText size={16} className="text-directrice" />
        Par catégorie
      </h2>
      <div className="space-y-3">
        {categories.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm text-gray-600 flex-1">{label}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}15` }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Activite Tab ──────────────────────────────────────────────────────────────

function ActiviteTab({ activiteCSD, onNavigate }: { activiteCSD: ActiviteCSD[]; onNavigate: (path: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {activiteCSD.map((csd) => (
        <CSDCard key={csd.csd} csd={csd} onNavigate={onNavigate} />
      ))}
    </div>
  )
}

function CSDCard({ csd, onNavigate }: { csd: ActiviteCSD; onNavigate: (path: string) => void }) {
  const progressPercent = Math.round((csd.evalues / csd.total) * 100)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 text-white bg-directrice">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Comité Scientifique</p>
            <h3 className="text-lg font-bold">CSD {csd.csd}</h3>
            <p className="text-white/70 text-sm">{csd.departement}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl font-black">{csd.csd}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { label: 'Total', value: csd.total, color: 'var(--color-directrice)' },
          { label: 'En attente', value: csd.enAttente, color: 'var(--color-status-evaluation)' },
          { label: 'Évalués', value: csd.evalues, color: 'var(--color-status-accepte)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-4">
            <span className="text-2xl font-bold" style={{ color }}>{value}</span>
            <span className="text-xs text-gray-400 mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      <div className="px-6 py-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progression des évaluations</span>
          <span className="font-semibold">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 bg-status-accepte" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users size={12} />
            {csd.membresActifs} membres actifs
          </div>
          <button onClick={() => onNavigate('/admin/dossiers')} className="flex items-center gap-1 text-xs font-semibold text-directrice hover:underline">
            Voir les dossiers <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Loading & Error Screens ───────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-directrice animate-spin" />
        <p className="text-sm text-gray-400">Chargement du tableau de bord...</p>
      </div>
    </div>
  )
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <p className="font-semibold text-gray-700 mb-1">Erreur de chargement</p>
        <p className="text-sm text-gray-400 mb-4">{message}</p>
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold bg-directrice hover:opacity-90 transition-opacity mx-auto">
          <RefreshCw size={14} />
          Réessayer
        </button>
      </div>
    </div>
  )
}
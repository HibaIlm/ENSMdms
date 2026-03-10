import {
  LayoutDashboard, FolderOpen, Users, ShieldCheck,
  MessageSquare, GraduationCap,
} from 'lucide-react'
import BaseNavbar from './BaseNavbar'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavbarDirectriceProps {
  nomDirectrice?: string
  messagesNonLus?: number
  comptesEnAttente?: number
  onSwitchToEnseignante?: () => void
  onLogout?: () => void
}

// ── Nav config — single source of truth for Directrice navigation ─────────────

const NAV_ITEMS = (messagesNonLus: number, comptesEnAttente: number) => [
  { label: 'Tableau de bord', to: '/dashboard',        icon: LayoutDashboard },
  { label: 'Dossiers',        to: '/admin/dossiers',   icon: FolderOpen },
  { label: 'Comptes',         to: '/admin/users',      icon: Users,         badge: comptesEnAttente },
  { label: 'Rôles CSD',       to: '/admin/csd-roles',  icon: ShieldCheck },
  { label: 'Messages',        to: '/admin/messages',   icon: MessageSquare, badge: messagesNonLus },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function NavbarDirectrice({
  nomDirectrice = 'Directrice',
  messagesNonLus = 0,
  comptesEnAttente = 0,
  onSwitchToEnseignante,
  onLogout,
}: NavbarDirectriceProps) {
  return (
    <BaseNavbar
      logoIcon={GraduationCap}
      logoTitle="Direction Doctorale"
      logoSubtitle="Administration"
      navItems={NAV_ITEMS(messagesNonLus, comptesEnAttente)}
      displayName={nomDirectrice}
      roleLabel="Directrice"
      bgClass="bg-directrice"
      activeTextClass="text-directrice"
      onLogout={onLogout}
      rightSlot={
        onSwitchToEnseignante ? (
          <button
            onClick={onSwitchToEnseignante}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-white/30 text-white/90 hover:bg-white/10 transition-all"
          >
            <GraduationCap size={14} />
            Mode Enseignante
          </button>
        ) : undefined
      }
      extraProfileActions={
        onSwitchToEnseignante
          ? [{ label: 'Mode Enseignante', icon: GraduationCap, onClick: onSwitchToEnseignante }]
          : []
      }
    />
  )
}
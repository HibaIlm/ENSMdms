import {
  LayoutDashboard, FolderOpen, Users, ShieldCheck,
  MessageSquare, GraduationCap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BaseNavbar from './BaseNavbar'
import { useAuth } from '../hooks/useAuth'
import { useNotificationStore } from '../store/notificationStore'

// ── Nav items factory — reads badge counts from notification store ─────────────
// Counts come from notificationStore (global, fetched once in App.tsx).
// Never passed as props — so badges are consistent on every page.

function buildNavItems(messagesNonLus: number, comptesEnAttente: number) {
  return [
    { label: 'Tableau de bord', to: '/dashboard',        icon: LayoutDashboard },
    { label: 'Dossiers',        to: '/admin/dossiers',   icon: FolderOpen },
    { label: 'Comptes',         to: '/admin/users',      icon: Users,         badge: comptesEnAttente },
    { label: 'Rôles CSD',       to: '/admin/csd-roles',  icon: ShieldCheck },
    { label: 'Messages',        to: '/admin/messages',   icon: MessageSquare, badge: messagesNonLus },
  ]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NavbarDirectrice({
  onSwitchToEnseignante,
}: {
  onSwitchToEnseignante?: () => void
}) {
  const navigate = useNavigate()
  const { fullName } = useAuth()
  const { messagesNonLus, comptesEnAttente } = useNotificationStore()

  return (
    <BaseNavbar
      logoIcon={GraduationCap}
      logoTitle="Direction Doctorale"
      logoSubtitle="Administration"
      navItems={buildNavItems(messagesNonLus, comptesEnAttente)}
      displayName={fullName}
      roleLabel="Directrice"
      bgClass="bg-directrice"
      activeTextClass="text-directrice"
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
import { LayoutDashboard, FolderOpen, MessageSquare, ShieldCheck, Eye, CheckCircle2 } from 'lucide-react'
import BaseNavbar from './BaseNavbar'
import { useAuth } from '../hooks/useAuth'
import { useNotificationStore } from '../store/notificationStore'
import type { CSDRole } from '../types'

// ── Role config ───────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<CSDRole, { label: string; icon: typeof Eye }> = {
  consultation: { label: 'Consultation', icon: Eye },
  validation:   { label: 'Validation',   icon: CheckCircle2 },
}

// ── Nav items factory — reads badge counts from notification store ─────────────

function buildNavItems(csdMessagesNonLus: number, dossiersEnAttente: number) {
  return [
    { label: 'Tableau de bord',   to: '/csd/dashboard', icon: LayoutDashboard },
    { label: 'Dossiers assignés', to: '/csd/dossiers',  icon: FolderOpen,     badge: dossiersEnAttente },
    { label: 'Messages',          to: '/csd/messages',  icon: MessageSquare,  badge: csdMessagesNonLus },
  ]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NavbarCSD() {
  const { fullName, user } = useAuth()
  const { csdMessagesNonLus, dossiersEnAttente } = useNotificationStore()

  const role: CSDRole = user?.csdRole ?? 'consultation'
  const roleConfig = ROLE_CONFIG[role]
  const RoleIcon = roleConfig.icon

  return (
    <BaseNavbar
      logoIcon={ShieldCheck}
      logoTitle="Espace CSD"
      logoSubtitle={user?.departement}
      navItems={buildNavItems(csdMessagesNonLus, dossiersEnAttente)}
      displayName={fullName}
      roleLabel={roleConfig.label}
      bgClass="bg-csd"
      activeTextClass="text-csd"
      rightSlot={
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: role === 'validation'
              ? 'var(--color-csd-role-validation-bg)'
              : 'var(--color-csd-role-consultation-bg)',
            color: role === 'validation'
              ? 'var(--color-csd-role-validation-text)'
              : 'var(--color-csd-role-consultation-text)',
          }}
        >
          <RoleIcon size={12} />
          {roleConfig.label}
        </div>
      }
    />
  )
}
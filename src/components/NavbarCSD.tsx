import { LayoutDashboard, FolderOpen, MessageSquare, ShieldCheck, Eye, CheckCircle2 } from 'lucide-react'
import BaseNavbar from './BaseNavbar'
import type { CSDRole } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavbarCSDProps {
  nomMembre?: string
  role?: CSDRole
  departement?: string
  messagesNonLus?: number
  dossiersNonTraites?: number
  onLogout?: () => void
}

// ── Role config — single source of truth for CSD role display ─────────────────

const ROLE_CONFIG: Record<CSDRole, { label: string; icon: typeof Eye }> = {
  consultation: { label: 'Consultation', icon: Eye },
  validation:   { label: 'Validation',   icon: CheckCircle2 },
}

// ── Nav config — single source of truth for CSD navigation ───────────────────

const NAV_ITEMS = (messagesNonLus: number, dossiersNonTraites: number) => [
  { label: 'Tableau de bord',   to: '/csd/dashboard', icon: LayoutDashboard },
  { label: 'Dossiers assignés', to: '/csd/dossiers',  icon: FolderOpen,     badge: dossiersNonTraites },
  { label: 'Messages',          to: '/csd/messages',  icon: MessageSquare,  badge: messagesNonLus },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function NavbarCSD({
  nomMembre = 'Membre CSD',
  role = 'consultation',
  departement,
  messagesNonLus = 0,
  dossiersNonTraites = 0,
  onLogout,
}: NavbarCSDProps) {
  const roleConfig = ROLE_CONFIG[role]
  const RoleIcon = roleConfig.icon

  return (
    <BaseNavbar
      logoIcon={ShieldCheck}
      logoTitle="Espace CSD"
      logoSubtitle={departement}
      navItems={NAV_ITEMS(messagesNonLus, dossiersNonTraites)}
      displayName={nomMembre}
      roleLabel={roleConfig.label}
      bgClass="bg-csd"
      activeTextClass="text-csd"
      onLogout={onLogout}
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
import { LayoutDashboard, FolderOpen, PlusCircle, User, GraduationCap, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BaseNavbar from './BaseNavbar'
import { useAuth } from '../hooks/useAuth'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavbarEnseignantProps {
  nomEnseignant?: string
}

// ── Nav config — single source of truth for Enseignant navigation ─────────────

const NAV_ITEMS = [
  { label: 'Tableau de bord', to: '/ens/dashboard',     icon: LayoutDashboard },
  { label: 'Nouveau dépôt',   to: '/ens/depot/nouveau', icon: PlusCircle },
  { label: 'Mes dossiers',    to: '/ens/dossiers',       icon: FolderOpen },
  { label: 'Mon profil',      to: '/ens/profil',         icon: User },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function NavbarEnseignant({ nomEnseignant }: NavbarEnseignantProps) {
  const navigate = useNavigate()
  const { fullName, isDirectrice } = useAuth()

  return (
    <BaseNavbar
      logoIcon={GraduationCap}
      logoTitle="Direction Doctorale"
      logoSubtitle="Espace Enseignant"
      navItems={NAV_ITEMS}
      displayName={nomEnseignant ?? fullName}
      roleLabel="Enseignant(e)"
      bgClass="bg-enseignant"
      activeTextClass="text-enseignant"
      // If Directrice is in Mode Enseignante — show "Retour Admin" in right slot
      rightSlot={
        isDirectrice ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-white/30 text-white/90 hover:bg-white/10 transition-all"
          >
            <ShieldCheck size={14} />
            Retour Admin
          </button>
        ) : undefined
      }
      extraProfileActions={
        isDirectrice
          ? [{ label: 'Retour Admin', icon: ShieldCheck, onClick: () => navigate('/dashboard') }]
          : []
      }
    />
  )
}
// ─────────────────────────────────────────────────────────────────
// components/NavbarEnseignant.tsx
//
// HOW TO USE:
//   <NavbarEnseignant activePage="dashboard" />
//   <NavbarEnseignant activePage="dossiers"  />
//
// activePage values: "dashboard" | "depot" | "dossiers" | "profil"
//
// User info is read from the auth store automatically.
// When the Directrice is in Mode Enseignante (F-04), a "Retour Admin"
// button appears in the right chip area and in the dropdown.
// ─────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { C } from '../constants/theme'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavbarEnseignantProps {
  // activePage is kept for backwards compatibility but is now ignored —
  // active state is derived from the current URL via useLocation so it
  // always stays in sync with navigation automatically.
  activePage?: string
}

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Tableau de bord', to: '/ens/dashboard'     },
  { id: 'depot',     icon: '📤', label: 'Nouveau Dépôt',   to: '/ens/depot/nouveau' },
  { id: 'dossiers',  icon: '📂', label: 'Mes Dossiers',    to: '/ens/dossiers'      },
  { id: 'profil',    icon: '👤', label: 'Mon Profil',       to: '/ens/profil'        },
]

// ── TopBar ────────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div style={{
      background: C.blueLight, color: C.white,
      padding: '6px 32px', fontSize: 13,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <span style={{ cursor: 'pointer' }}>✉ Messagerie</span>
        <span style={{ cursor: 'pointer' }}>🖥 E-learning</span>
        <span style={{ cursor: 'pointer' }}>📡 WEB TV</span>
        <span style={{ cursor: 'pointer' }}>📞 Contact</span>
      </div>
      <span style={{ cursor: 'pointer' }}>🌐 Français</span>
    </div>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  const navigate = useNavigate()
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
      onClick={() => navigate('/ens/dashboard')}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 8,
        background: C.navy, color: C.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 16, flexShrink: 0,
      }}>
        ENS
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.navyDark }}>
          École Nationale Supérieure de Management
        </div>
        <div style={{ fontSize: 11, color: C.gray600 }}>
          Direction Doctorale — Espace Enseignant
        </div>
      </div>
    </div>
  )
}

// ── NavBtn ────────────────────────────────────────────────────────────────────

function NavBtn({ icon, label, to, active }: {
  icon: string
  label: string
  to: string
  active: boolean
}) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)
  const highlighted = active || hover

  return (
    <button
      onClick={() => navigate(to)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '8px 15px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: highlighted ? 700 : 500,
        border: 'none',
        cursor: 'pointer',
        background:   highlighted ? C.bluePale : 'transparent',
        color:        highlighted ? C.blue     : C.gray600,
        borderBottom: highlighted ? `2px solid ${C.blue}` : '2px solid transparent',
        transition: 'all .15s',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
      }}
    >
      {icon} {label}
    </button>
  )
}

// ── UserChip + dropdown ───────────────────────────────────────────────────────

function UserChip({
  initials,
  name,
  email,
  grade,
  isDirectrice,
}: {
  initials: string
  name: string
  email?: string
  grade?: string
  isDirectrice: boolean
}) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    setOpen(false)
    logout()
    navigate('/login')
  }

  const DROPDOWN_ITEMS = [
    { icon: '👤', label: 'Mon Profil',   to: '/ens/profil'   },
    { icon: '📂', label: 'Mes Dossiers', to: '/ens/dossiers' },
    ...(isDirectrice
      ? [{ icon: '🛡', label: 'Retour Admin', to: '/dashboard' }]
      : []),
  ]

  return (
    <div style={{ position: 'relative' }}>
      {/* Chip trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: C.gray100, borderRadius: 24,
          padding: '6px 14px 6px 8px', cursor: 'pointer',
          border: open ? `2px solid ${C.blueLight}` : '2px solid transparent',
          transition: 'border .15s',
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: C.navy, color: C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 12,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navyDark }}>{name}</div>
          {grade && <div style={{ fontSize: 10, color: C.gray400 }}>{grade}</div>}
        </div>
        <span style={{ color: C.gray400, fontSize: 11 }}>{open ? '▴' : '▾'}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {/* Click-outside overlay */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: C.white, borderRadius: 10, minWidth: 210,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: `1px solid ${C.gray200}`, overflow: 'hidden', zIndex: 100,
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: `1px solid ${C.gray100}`,
              background: C.offWhite,
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.navyDark }}>{name}</div>
              {email && <div style={{ fontSize: 11, color: C.gray400 }}>{email}</div>}
            </div>

            {/* Nav links */}
            {DROPDOWN_ITEMS.map(item => (
              <DropdownRow
                key={item.to}
                icon={item.icon}
                label={item.label}
                onClick={() => { navigate(item.to); setOpen(false) }}
              />
            ))}

            {/* Logout */}
            <div style={{ borderTop: `1px solid ${C.gray100}` }}>
              <DropdownRow
                icon="🚪"
                label="Se déconnecter"
                danger
                onClick={handleLogout}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DropdownRow({ icon, label, onClick, danger = false }: {
  icon: string
  label: string
  onClick: () => void
  danger?: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '11px 16px', cursor: 'pointer', fontSize: 13,
        color: danger ? C.red : C.navyDark,
        background: hover ? (danger ? C.redLight : C.gray100) : C.white,
        display: 'flex', alignItems: 'center', gap: 10,
        transition: 'background .1s',
      }}
    >
      {icon} {label}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NavbarEnseignant({ activePage: _ }: NavbarEnseignantProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { fullName, isDirectrice } = useAuth()

  const initials = fullName
    ? fullName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'EN'

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <TopBar />

      <div style={{
        background: C.white,
        borderBottom: `3px solid ${C.blueLight}`,
        padding: '0 32px', height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(26,58,92,0.08)',
      }}>
        <Logo />

        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map(n => (
            <NavBtn
              key={n.id}
              icon={n.icon}
              label={n.label}
              to={n.to}
              active={pathname.startsWith(n.to)}
            />
          ))}
        </nav>

        {/* Right side — Retour Admin (Directrice only) + user chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isDirectrice && (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                fontSize: 12, fontWeight: 600, color: C.teal,
                background: '#D0F0F5', borderRadius: 6, padding: '4px 10px',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <ShieldCheck size={13} />
              Retour Admin
            </button>
          )}
          <UserChip
            initials={initials}
            name={fullName ?? 'Enseignant'}
            isDirectrice={isDirectrice}
          />
        </div>
      </div>
    </div>
  )
}
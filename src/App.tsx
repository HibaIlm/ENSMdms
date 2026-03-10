import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Routes
import ProtectedRoute from './routes/protectedRoute'

// Pages — Auth
import Register from './pages/auth/Register'

// Pages — Directrice
import DashboardDirectrice from './pages/directrice/Dashboard'
import DirectriceMessages from './pages/directrice/Messages'
// ↓ From App.js (Page04, Page07) — not yet in App.tsx
import GestionComptes from './pages/directrice/Page04_GestionComptes'
import DetailDossierDirectrice from './pages/directrice/Page07_DetailDossierDirectrice'

// Pages — Enseignant
import MesDossiers from './pages/enseignant/MesDossiers'
// ↓ From App.js — replacing <div> placeholders
import EnseignantDashboard from './pages/enseignant/Page09_EnseignantDashboard'
import NouveauDepot from './pages/enseignant/Page10_NouveauDepot'
import DetailDossierEnseignant from './pages/enseignant/Page12_DetailDossierEnseignant'
import MonProfil from './pages/enseignant/Page13_MonProfil'

// Pages — CSD
import CSDDashboard from './pages/csd/Dashboard'
import DossiersAssignes from './pages/csd/DossiersAssignes'

// Pages — Errors
// ↓ From App.js — replaces the bare <Navigate> fallback for 403
import { ErrorPage } from './pages/enseignant/Page18_ErrorPages'

// Layouts
import EnseignantLayout from './layouts/EnseignantLayout'
import DirectriceLayout from './layouts/DirectriceLayout'
import CSDLayout from './layouts/CSDLayout'

// Auth store
import { useAuthStore, MOCK_DEV_PROFILES } from './store/authStore'

// ── Dev role switcher ─────────────────────────────────────────────────────────
// Floating panel — dev only, hidden in production (import.meta.env.PROD).
// Shows all profiles from MOCK_DEV_PROFILES including both CSD roles.
// To add a new testable profile: add it to MOCK_DEV_PROFILES in authStore.ts.
// REMOVE this component and its usage when backend is ready.

function DevRoleSwitcher() {
  const setMockUser = useAuthStore((s) => s.setMockUser)
  const user = useAuthStore((s) => s.user)

  if (import.meta.env.PROD) return null

  // Build current label — shows role + csdRole if applicable
  const currentLabel = user
    ? user.role === 'csd' && user.csdRole
      ? `${user.role} (${user.csdRole})`
      : user.role
    : 'Non connecté'

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs space-y-2 min-w-[160px]">
      <p className="font-semibold text-gray-400 uppercase tracking-wide text-[10px]">
        Dev — profil actuel
      </p>
      <p className="font-bold text-gray-700 truncate">{currentLabel}</p>

      <div className="h-px bg-gray-100" />

      <div className="flex flex-col gap-1">
        {MOCK_DEV_PROFILES.map((profile) => {
          const isActive = user?.id === profile.user.id
          return (
            <button
              key={profile.user.id}
              onClick={() => setMockUser(profile.user)}
              className={`px-3 py-1.5 rounded-lg text-white font-medium transition-all text-left ${
                isActive ? 'opacity-100 ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: profile.color,
                ...(isActive ? { outlineColor: profile.color } : {}),
              }}
            >
              {profile.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Login page placeholder ────────────────────────────────────────────────────
// Replace this entire component with a real <Login /> page when backend is ready.
// It shows a minimal login screen in dev — use the DevRoleSwitcher to pick a role,
// then click "Entrer" to simulate a successful login.
// It does NOT auto-login on mount so that logout() works correctly.

function LoginRedirect() {
  const user = useAuthStore((s) => s.user)
  const setMockUser = useAuthStore((s) => s.setMockUser)

  // If already authenticated, redirect to their dashboard
  if (user) {
    const redirectMap: Record<string, string> = {
      directrice: '/dashboard',
      enseignant: '/ens/dashboard',
      csd: '/csd/dashboard',
    }
    return <Navigate to={redirectMap[user.role]} replace />
  }

  // No auto-login here — user explicitly logged out or has never logged in.
  // In dev: use DevRoleSwitcher (bottom-right) to pick a profile, then click Entrer.
  return (
    <div className="min-h-screen bg-page-directrice flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-directrice flex items-center justify-center mx-auto">
          <span className="text-white text-2xl">🎓</span>
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-xl">Direction Doctorale</h1>
          <p className="text-sm text-gray-400 mt-1">Plateforme de gestion des enseignements</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
          <p className="text-xs font-semibold text-amber-700 mb-1">Mode développement</p>
          <p className="text-xs text-amber-600">
            Utilisez le panneau en bas à droite pour choisir un profil, puis cliquez sur Entrer.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {MOCK_DEV_PROFILES.map((profile) => (
            <button
              key={profile.user.id}
              onClick={() => setMockUser(profile.user)}
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: profile.color }}
            >
              {profile.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-300">
          Cette page sera remplacée par une vraie page de connexion avec le backend.
        </p>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <DevRoleSwitcher />
      <Routes>

        {/* ── Public ── */}
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/403" element={<ErrorPage type="403" />} />

        {/* ── Directrice ── */}
        <Route element={<ProtectedRoute allowedRoles={['directrice']} />}>
          <Route element={<DirectriceLayout />}>
            <Route path="/dashboard" element={<DashboardDirectrice />} />
            <Route path="/admin/messages" element={<DirectriceMessages />} />
            {/* ↓ Added from App.js */}
            <Route path="/admin/users" element={<GestionComptes />} />
            <Route path="/admin/dossiers/:id" element={<DetailDossierDirectrice />} />
          </Route>
        </Route>

        {/* ── Enseignant ── */}
        {/* Directrice can also access enseignant routes (Mode Enseignante — F-04) */}
        <Route element={<ProtectedRoute allowedRoles={['enseignant', 'directrice']} />}>
          <Route element={<EnseignantLayout />}>
            {/* ↓ Replaced <div> placeholders with real components from App.js */}
            <Route path="/ens/dashboard" element={<EnseignantDashboard />} />
            <Route path="/ens/dossiers" element={<MesDossiers />} />
            <Route path="/ens/depot/nouveau" element={<NouveauDepot />} />
            <Route path="/ens/dossiers/:id" element={<DetailDossierEnseignant />} />
            <Route path="/ens/profil" element={<MonProfil />} />
          </Route>
        </Route>

        {/* ── CSD ── */}
        <Route element={<ProtectedRoute allowedRoles={['csd']} />}>
          <Route element={<CSDLayout />}>
            <Route path="/csd/dashboard" element={<CSDDashboard />} />
            <Route path="/csd/dossiers" element={<DossiersAssignes />} />
            <Route path="/csd/dossiers/:id" element={<div>Détail Dossier CSD</div>} />
            <Route path="/csd/messages" element={<div>Messagerie CSD</div>} />
          </Route>
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
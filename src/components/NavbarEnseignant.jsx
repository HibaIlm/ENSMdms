// ─────────────────────────────────────────────────────────────────
// components/NavbarEnseignant.jsx
//
// HOW TO USE IN ANY PAGE:
//   1. Import it:
//        import NavbarEnseignant from '../components/NavbarEnseignant';
//
//   2. Drop it at the top of your JSX, passing the active page key:
//        <NavbarEnseignant active="dashboard" user={CURRENT_USER} />
//
//   3. The "active" prop highlights the correct nav link.
//      Accepted values: "dashboard" | "depot" | "dossiers" | "profil"
//
//   4. The "user" prop expects: { prenom, nom, initiales, grade, departement }
//
// The component uses react-router's useNavigate() to navigate between
// pages — no page reload, real SPA navigation.
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../constants/theme";

const NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord", icon: "🏠", route: "/ens/dashboard" },
  { id: "depot",     label: "Nouveau Dépôt",   icon: "📤", route: "/ens/depot/nouveau"     },
  { id: "dossiers",  label: "Mes Dossiers",    icon: "📂", route: "/ens/dossiers"  },
  { id: "profil",    label: "Mon Profil",      icon: "👤", route: "/ens/profil"    },
];

function NavButton({ item, active }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const isHighlighted = active === item.id || hover;

  return (
    <button
      onClick={() => navigate(item.route)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "8px 16px",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        border: "none",
        background: isHighlighted ? C.bluePale : "transparent",
        color: isHighlighted ? C.blue : C.gray600,
        borderBottom: isHighlighted ? `2px solid ${C.blue}` : "2px solid transparent",
        transition: "all .15s",
        fontFamily: "inherit",
      }}
    >
      {item.icon} {item.label}
    </button>
  );
}

export default function NavbarEnseignant({ active, user }) {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const displayName = user ? `${user.prenom} ${user.nom}` : "Enseignant";
  const initiales   = user?.initiales || "??";

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      {/* ── Top utility bar ── */}
      <div style={{
        background: C.blueLight,
        padding: "6px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 13,
        color: C.white,
      }}>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ cursor: "pointer" }}>✉ Messagerie</span>
          <span style={{ cursor: "pointer" }}>🖥 E-learning</span>
          <span style={{ cursor: "pointer" }}>📡 WEB TV</span>
          <span style={{ cursor: "pointer" }}>📞 Contact</span>
        </div>
        <span>🌐 Français</span>
      </div>

      {/* ── Main header ── */}
      <div style={{
        background: C.white,
        borderBottom: `3px solid ${C.blueLight}`,
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 70,
        boxShadow: "0 2px 8px rgba(26,58,92,0.08)",
      }}>
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          onClick={() => navigate("/ens/dashboard")}
        >
          <div style={{
            width: 44, height: 44, background: C.navy, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.white, fontWeight: 800, fontSize: 16, letterSpacing: 1,
          }}>
            ENS
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.navyDark }}>
              École Nationale Supérieure de Management
            </div>
            <div style={{ fontSize: 11, color: C.gray600 }}>
              Direction Doctorale — Espace Enseignant
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {NAV_ITEMS.map(item => (
            <NavButton key={item.id} item={item} active={active} />
          ))}
        </div>

        {/* User chip */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setUserMenuOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: C.gray100, borderRadius: 24,
              padding: "6px 14px 6px 8px", cursor: "pointer",
              border: userMenuOpen ? `2px solid ${C.blueLight}` : "2px solid transparent",
              transition: "border .15s",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: C.navy, color: C.white,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 12,
            }}>
              {initiales}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navyDark }}>{displayName}</div>
              {user && <div style={{ fontSize: 10, color: C.gray400 }}>{user.grade}</div>}
            </div>
            <span style={{ color: C.gray400, fontSize: 11 }}>{userMenuOpen ? "▴" : "▾"}</span>
          </div>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: C.white, borderRadius: 10, minWidth: 200,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: `1px solid ${C.gray200}`, overflow: "hidden", zIndex: 100,
            }}>
              {/* User info header */}
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.gray100}`, background: C.offWhite }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navyDark }}>{displayName}</div>
                <div style={{ fontSize: 11, color: C.gray400 }}>{user?.email}</div>
              </div>
              {/* Menu items */}
              {[
                { icon: "👤", label: "Mon Profil",     route: "/ens/profil"    },
                { icon: "📂", label: "Mes Dossiers",   route: "/ens/dossiers"  },
              ].map(item => (
                <div
                  key={item.route}
                  onClick={() => { navigate(item.route); setUserMenuOpen(false); }}
                  style={{
                    padding: "11px 16px", cursor: "pointer", fontSize: 13,
                    color: C.navyDark, display: "flex", alignItems: "center", gap: 10,
                    transition: "background .1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.gray100}
                  onMouseLeave={e => e.currentTarget.style.background = C.white}
                >
                  {item.icon} {item.label}
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.gray100}` }}>
                <div
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "11px 16px", cursor: "pointer", fontSize: 13,
                    color: C.red, display: "flex", alignItems: "center", gap: 10,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.redLight}
                  onMouseLeave={e => e.currentTarget.style.background = C.white}
                >
                  🚪 Se déconnecter
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

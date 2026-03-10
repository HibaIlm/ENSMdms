// ================================================================
//  src/components/Navbar.jsx
//  Shared navigation bar — import and use in every page
//
//  EXPORTS:
//    EnsNavbar    → for Enseignant pages  (/ens/...)
//    AdminNavbar  → for Directrice pages  (/admin/... /dashboard)
//    C            → shared color palette  (use in every page file)
//    STATUS_MAP   → badge colors by status
//    CAT_MAP      → category icons/colors
//
//  HOW TO USE IN A PAGE (3 steps):
//
//  Step 1 – import at the top of your page file:
//    import { EnsNavbar, C } from "../components/Navbar";
//
//  Step 2 – put <EnsNavbar activePage="dashboard" /> as the FIRST
//            child inside your root <div>:
//    export default function MyPage() {
//      return (
//        <div style={{ fontFamily: "'Segoe UI',sans-serif",
//                      background: C.offWhite, minHeight:"100vh" }}>
//          <EnsNavbar activePage="dashboard" />
//          <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
//            ...your page content...
//          </div>
//        </div>
//      );
//    }
//
//  Step 3 – pass the right activePage id so the correct tab lights up:
//    EnsNavbar   ids:  "dashboard" | "depot" | "dossiers" | "profil"
//    AdminNavbar ids:  "dashboard" | "dossiers" | "users" | "csd" | "messages"
// ================================================================

import { useNavigate, useLocation } from "react-router-dom";

// ── Colour palette ─────────────────────────────────────────────
// Import C in every page so colours are always consistent
export const C = {
  navy:        "#1A3A5C",
  navyDark:    "#0D2137",
  blue:        "#1A6FA8",
  blueLight:   "#2E9CCA",
  bluePale:    "#D6EAF8",
  teal:        "#17748A",
  offWhite:    "#F4F8FC",
  gray100:     "#F0F4F8",
  gray200:     "#DDE6EE",
  gray400:     "#94A3B8",
  gray600:     "#4A6580",
  green:       "#16A34A",
  greenLight:  "#DCFCE7",
  orange:      "#D97706",
  orangeLight: "#FEF3C7",
  red:         "#DC2626",
  redLight:    "#FEE2E2",
  yellow:      "#CA8A04",
  yellowLight: "#FEF9C3",
  purple:      "#6D28D9",
  purpleLight: "#EDE9FE",
  white:       "#FFFFFF",
};

// ── Shared status badge map ─────────────────────────────────────
export const STATUS_MAP = {
  soumis:      { label: "Soumis",           bg: C.gray200,      text: C.gray600 },
  evaluation:  { label: "En évaluation",    bg: C.orangeLight,  text: C.orange  },
  accepte:     { label: "Accepté",          bg: C.greenLight,   text: C.green   },
  refuse:      { label: "Refusé",           bg: C.redLight,     text: C.red     },
  corrections: { label: "Corrections dem.", bg: C.yellowLight,  text: C.yellow  },
  communique:  { label: "Décision rendue",  bg: C.bluePale,     text: C.blue    },
};

// ── Shared category map ─────────────────────────────────────────
export const CAT_MAP = {
  cours:       { icon: "🎓", color: C.blue },
  publication: { icon: "📄", color: C.teal },
  ouvrage:     { icon: "📚", color: C.navy },
};

// ── Internal: single nav button ─────────────────────────────────
function NavBtn({ icon, label, to, active }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}   // ← THIS is what actually changes the page
      style={{
        padding: "8px 15px",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        border: "none",
        cursor: "pointer",
        background:    active ? C.bluePale    : "transparent",
        color:         active ? C.blue        : C.gray600,
        borderBottom:  active ? `2px solid ${C.blue}` : "2px solid transparent",
        transition: "all .15s",
        whiteSpace: "nowrap",
      }}
    >
      {icon} {label}
    </button>
  );
}

// ── Internal: slim top utility bar ──────────────────────────────
function TopBar() {
  return (
    <div style={{
      background: C.blueLight, color: C.white,
      padding: "6px 32px", fontSize: 13,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", gap: 20 }}>
        <span>✉ Messagerie</span>
        <span>🖥 E-learning</span>
        <span>📡 WEB TV</span>
        <span>📞 Contact</span>
      </div>
      <span>🌐 Français</span>
    </div>
  );
}

// ── Internal: ENSM logo block ────────────────────────────────────
function Logo({ subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 8,
        background: C.navy, color: C.white,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 16, flexShrink: 0,
      }}>
        ENS
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.navyDark }}>
          École Nationale Supérieure de Management
        </div>
        <div style={{ fontSize: 11, color: C.gray600 }}>{subtitle}</div>
      </div>
    </div>
  );
}

// ── Internal: header shell (white bar with logo + nav + user) ───
function HeaderShell({ subtitle, navItems, activePage, userChip }) {
  return (
    <div style={{
      background: C.white,
      borderBottom: `3px solid ${C.blueLight}`,
      padding: "0 32px", height: 70,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 2px 8px rgba(26,58,92,0.08)",
    }}>
      <Logo subtitle={subtitle} />
      <nav style={{ display: "flex", gap: 4 }}>
        {navItems.map(n => (
          <NavBtn
            key={n.id}
            icon={n.icon}
            label={n.label}
            to={n.to}
            active={activePage === n.id}
          />
        ))}
      </nav>
      {userChip}
    </div>
  );
}

// ── Internal: user avatar chip ───────────────────────────────────
function UserChip({ initials, name }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: C.gray100, borderRadius: 24,
      padding: "6px 14px 6px 8px", cursor: "pointer",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: C.navy, color: C.white,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 12,
      }}>
        {initials}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.navyDark }}>{name}</span>
      <span style={{ color: C.gray400, fontSize: 12 }}>▾</span>
    </div>
  );
}

// ==============================================================
//  EnsNavbar
//  Use on: /ens/dashboard  /ens/depot  /ens/dossiers  /ens/profil
//
//  Props:
//    activePage  "dashboard" | "depot" | "dossiers" | "profil"
//    userName    string   (default "Pr. Ben Moussa")
//    initials    string   (default "BM")
// ==============================================================
export function EnsNavbar({
  activePage = "dashboard",
  userName   = "Pr. Ben Moussa",
  initials   = "BM",
}) {
  const NAV = [
    { id: "dashboard", icon: "🏠", label: "Tableau de bord", to: "/ens/dashboard" },
    { id: "depot",     icon: "📤", label: "Nouveau Dépôt",   to: "/ens/depot"     },
    { id: "dossiers",  icon: "📂", label: "Mes Dossiers",    to: "/ens/dossiers"  },
    { id: "profil",    icon: "👤", label: "Mon Profil",      to: "/ens/profil"    },
  ];

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <TopBar />
      <HeaderShell
        subtitle="Direction Doctorale — Espace Enseignant"
        navItems={NAV}
        activePage={activePage}
        userChip={<UserChip initials={initials} name={userName} />}
      />
    </div>
  );
}

// ==============================================================
//  AdminNavbar
//  Use on: /dashboard  /admin/dossiers  /admin/users
//          /admin/csd-roles  /admin/messages
//
//  Props:
//    activePage  "dashboard" | "dossiers" | "users" | "csd" | "messages"
//    userName    string  (default "Dr. Directrice")
//    initials    string  (default "DD")
// ==============================================================
export function AdminNavbar({
  activePage = "dashboard",
  userName   = "Dr. Directrice",
  initials   = "DD",
}) {
  const navigate = useNavigate();

  const NAV = [
    { id: "dashboard", icon: "🏠", label: "Tableau de bord", to: "/dashboard"        },
    { id: "dossiers",  icon: "📁", label: "Dossiers",         to: "/admin/dossiers"   },
    { id: "users",     icon: "👥", label: "Comptes",          to: "/admin/users"      },
    { id: "csd",       icon: "⚙",  label: "Rôles CSD",        to: "/admin/csd-roles"  },
    { id: "messages",  icon: "✉",  label: "Messages",         to: "/admin/messages"   },
  ];

  const chip = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        fontSize: 12, fontWeight: 600, color: C.orange,
        background: C.orangeLight, borderRadius: 6, padding: "4px 10px",
      }}>
        👑 Directrice
      </span>
      <button
        onClick={() => navigate("/ens/dashboard")}
        style={{
          fontSize: 12, fontWeight: 600, color: C.teal,
          background: "#D0F0F5", borderRadius: 6, padding: "4px 10px",
          border: "none", cursor: "pointer",
        }}
      >
        🔄 Mode Enseignante
      </button>
      <UserChip initials={initials} name={userName} />
    </div>
  );

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <TopBar />
      <HeaderShell
        subtitle="Direction Doctorale — Espace Administration"
        navItems={NAV}
        activePage={activePage}
        userChip={chip}
      />
    </div>
  );
}

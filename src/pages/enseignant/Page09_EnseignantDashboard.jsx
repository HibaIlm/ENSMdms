// ─────────────────────────────────────────────────────────────────
// pages/Page09_EnseignantDashboard.jsx
// Route: /ens/dashboard
// ─────────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import NavbarEnseignant from "../../components/NavbarEnseignant";
import { C, STATUS_CONFIG, CAT_CONFIG } from "../../constants/theme";
import { CURRENT_USER, getDossiersForUser, getNotifications } from "../../data/db";

// ── Pull data from dummy db ──
const user      = CURRENT_USER;
const dossiers  = getDossiersForUser(user.id).slice(0, 4); // show 4 most recent
const notifs    = getNotifications(user.id);
const unreadCount = notifs.filter(n => n.unread).length;

function StatCard({ num, label, color, icon }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "20px 24px", borderLeft: `4px solid ${color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.navyDark, lineHeight: 1 }}>{num}</div>
        <div style={{ fontSize: 12, color: C.gray600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function DossierRow({ d, onClick }) {
  const cat = CAT_CONFIG[d.categorie];
  const st  = STATUS_CONFIG[d.statut];
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, cursor: "pointer", transition: "background .12s" }}
      onMouseEnter={e => e.currentTarget.style.background = C.offWhite}
      onMouseLeave={e => e.currentTarget.style.background = C.white}
    >
      <div style={{ width: 40, height: 40, borderRadius: 8, background: cat.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{cat.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.navyDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.titre}</div>
        <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>{cat.label} · {d.dateDepot}</div>
      </div>
      <span style={{ background: st.bg, color: st.text, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
        {st.icon} {st.label}
      </span>
    </div>
  );
}

export default function EnseignantDashboard() {
  const navigate = useNavigate();

  const stats = [
    { num: dossiers.length,                                              label: "Dossiers soumis",       color: C.blue,   icon: "📁" },
    { num: dossiers.filter(d => d.statut === "evaluation").length,       label: "En évaluation",         color: C.orange, icon: "⏳" },
    { num: dossiers.filter(d => d.decisionFinale === "accepte").length,  label: "Acceptés",              color: C.green,  icon: "✅" },
    { num: unreadCount,                                                   label: "Notifications non lues",color: C.teal,   icon: "🔔" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
      <NavbarEnseignant active="dashboard" user={user} />

      <div style={{ flex: 1, padding: "32px 40px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Welcome banner */}
        <div style={{
          background: `linear-gradient(135deg, ${C.navyDark} 0%, ${C.navy} 60%, ${C.blue} 100%)`,
          borderRadius: 16, padding: "28px 36px", display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 32, color: C.white,
          boxShadow: "0 8px 24px rgba(13,33,55,0.18)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.06)", top: -60, right: -60 }} />
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.08)", top: 10, right: 40 }} />
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Bonjour, {user.prenom} {user.nom} 👋</div>
            <div style={{ fontSize: 14, opacity: 0.78 }}>Bienvenue sur votre espace enseignant — Direction Doctorale, ENSM</div>
          </div>
          <div style={{ display: "flex", gap: 16, position: "relative", zIndex: 1 }}>
            {[["Grade", user.grade], ["Département", user.departement]].map(([lbl, val]) => (
              <div key={lbl} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "10px 20px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{lbl}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Content grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>

          {/* Left: recent dossiers */}
          <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: C.navyDark, fontSize: 15 }}>📂 Dossiers Récents</div>
              <button onClick={() => navigate("/ens/dossiers")} style={{ background: "transparent", color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                Voir tout
              </button>
            </div>
            {dossiers.map(d => (
              <DossierRow key={d.id} d={d} onClick={() => navigate(`/ens/dossiers/${d.id}`)} />
            ))}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.gray100}` }}>
              <button
                onClick={() => navigate("/ens/depot/nouveau")}
                style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(26,111,168,0.3)" }}
              >
                📤 Nouveau Dépôt
              </button>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Quick actions */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray200}`, fontWeight: 700, color: C.navyDark, fontSize: 15 }}>⚡ Accès Rapides</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 24 }}>
                {[
                  { icon: "📤", label: "Déposer un document", sub: "Cours, publication, ouvrage", color: C.blue,  bg: C.bluePale,  route: "/ens/depot/nouveau"     },
                  { icon: "📂", label: "Mes dossiers",         sub: "Suivre mes soumissions",     color: C.teal,  bg: "#D0F0F5",   route: "/ens/dossiers"  },
                  { icon: "👤", label: "Mon profil",           sub: "Informations personnelles",  color: C.navy,  bg: C.gray100,   route: "/ens/profil"    },
                ].map((qa) => (
                  <button
                    key={qa.route}
                    onClick={() => navigate(qa.route)}   // ← THIS is the fix: real navigation
                    style={{ background: qa.bg, color: qa.color, border: `1.5px solid ${qa.color}30`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontWeight: 600, fontSize: 13, textAlign: "left", width: "100%", fontFamily: "inherit" }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: qa.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{qa.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{qa.label}</div>
                      <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>{qa.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray200}`, display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: C.navyDark, fontSize: 15 }}>
                🔔 Notifications
                {unreadCount > 0 && (
                  <span style={{ background: C.blueLight, color: C.white, borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{unreadCount}</span>
                )}
              </div>
              {notifs.map(n => (
                <div key={n.id} style={{ padding: "14px 24px", borderBottom: `1px solid ${C.gray100}`, background: n.unread ? `${C.bluePale}40` : C.white, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {n.unread
                    ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.blueLight, flexShrink: 0, marginTop: 5 }} />
                    : <div style={{ width: 8 }} />
                  }
                  <div>
                    <div style={{ fontSize: 13, color: C.navyDark, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: C.gray400, marginTop: 3 }}>{n.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

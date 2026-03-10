// ─────────────────────────────────────────────────────────────────
// pages/Page18_ErrorPages.jsx
// Routes: /404  /403
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../../constants/theme";
import { CURRENT_USER } from "../../data/db";

const ERROR_CONFIG = {
  "404": {
    code: "404", icon: "🔍", title: "Page introuvable",
    subtitle: "La page que vous cherchez n'existe pas ou a été déplacée.",
    illustrationBg: `linear-gradient(135deg, ${C.navyDark} 0%, ${C.navy} 60%, ${C.blue} 100%)`,
    tips: ["Vérifiez que l'URL est correctement saisie","La page a peut-être été déplacée","Naviguez depuis le menu principal"],
  },
  "403": {
    code: "403", icon: "🔒", title: "Accès refusé",
    subtitle: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
    illustrationBg: `linear-gradient(135deg, ${C.navyDark} 0%, #3D1A1A 60%, ${C.red} 100%)`,
    tips: ["Vous tentez d'accéder à une ressource réservée","Votre compte n'a pas les droits requis","Contactez la Directrice si vous pensez avoir les droits"],
  },
};

const ROLE_DESTINATIONS = {
  directrice: { label: "Tableau de bord Directrice", route: "/dashboard",    icon: "👑" },
  enseignant: { label: "Tableau de bord Enseignant", route: "/ens/dashboard", icon: "🎓" },
  csd:        { label: "Tableau de bord CSD",        route: "/csd/dashboard", icon: "👥" },
};

export function ErrorPage({ type = "404" }) {
  const navigate = useNavigate();
  const config   = ERROR_CONFIG[type];
  const dest     = ROLE_DESTINATIONS[CURRENT_USER?.role] || { label: "Se connecter", route: "/login", icon: "🔑" };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Minimal header */}
      <div style={{ background: C.blueLight, padding: "6px 32px", fontSize: 13, color: C.white }}>✉ Messagerie &nbsp; 🌐 Français</div>
      <div style={{ background: C.white, borderBottom: `3px solid ${C.blueLight}`, padding: "0 32px", height: 70, display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(26,58,92,0.08)" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ width: 44, height: 44, background: C.navy, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 16 }}>ENS</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.navyDark }}>École Nationale Supérieure de Management</div>
            <div style={{ fontSize: 11, color: C.gray600 }}>Direction Doctorale</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
          {/* Visual */}
          <div style={{ background: config.illustrationBg, borderRadius: 24, padding: "48px 40px 36px", marginBottom: 32, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(13,33,55,0.22)" }}>
            <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.05)", top: -80, right: -80 }} />
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.07)", top: 10, right: 50 }} />
            <div style={{ fontSize: 120, fontWeight: 900, color: "rgba(255,255,255,0.1)", lineHeight: 1, letterSpacing: -4, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", userSelect: "none" }}>
              {config.code}
            </div>
            <div style={{ fontSize: 64, marginBottom: 12, position: "relative", zIndex: 1 }}>{config.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.white, marginBottom: 8, position: "relative", zIndex: 1 }}>{config.title}</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto" }}>{config.subtitle}</div>
          </div>

          {/* Tips card */}
          <div style={{ background: C.white, borderRadius: 16, padding: "24px 32px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.navyDark, marginBottom: 12 }}>Que faire ?</div>
            {config.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 14, color: C.gray600, textAlign: "left" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, flexShrink: 0 }} />
                {tip}
              </div>
            ))}
            {type === "403" && (
              <div style={{ background: C.orangeLight, border: `1px solid ${C.orange}30`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: C.orange, marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span>📧</span> Contactez la Directrice : <strong>direction@ensm.dz</strong>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => navigate(dest.route)} style={{ background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: C.white, border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(26,111,168,0.3)" }}>
              {dest.icon} {dest.label}
            </button>
            <button onClick={() => window.history.back()} style={{ background: C.white, color: C.blue, border: `2px solid ${C.blue}`, borderRadius: 10, padding: "13px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              ← Page précédente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo toggle wrapper
export default function ErrorPageDemo() {
  const [type, setType] = useState("404");
  return (
    <div>
      <div style={{ position: "fixed", top: 10, right: 10, zIndex: 999, background: C.navyDark, borderRadius: 10, padding: "8px 14px", display: "flex", gap: 8, alignItems: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
        <span style={{ color: C.gray400, fontSize: 11, fontWeight: 600 }}>DÉMO</span>
        <button onClick={() => setType("404")} style={{ background: type==="404"?C.blue:C.gray600, color: C.white, border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>404</button>
        <button onClick={() => setType("403")} style={{ background: type==="403"?C.red:C.gray600, color: C.white, border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>403</button>
      </div>
      <ErrorPage type={type} />
    </div>
  );
}

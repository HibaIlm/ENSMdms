// ─────────────────────────────────────────────────────────────────
// pages/Page12_DetailDossierEnseignant.jsx
// Route: /ens/dossiers/:id
// ─────────────────────────────────────────────────────────────────
import { useNavigate, useParams } from "react-router-dom";
import NavbarEnseignant from "../../components/NavbarEnseignant";
import { C, STATUS_CONFIG, CAT_CONFIG } from "../../constants/theme";
import { CURRENT_USER, getDossierById } from "../../data/db";

const DECISION_CONFIG = {
  accepte:    { label: "Dossier Accepté",         color: C.green,  bg: C.greenLight,  icon: "✅" },
  refuse:     { label: "Dossier Refusé",          color: C.red,    bg: C.redLight,    icon: "❌" },
  corrections:{ label: "Corrections Demandées",   color: C.yellow, bg: C.yellowLight, icon: "🔄" },
};

export default function DetailDossierEnseignant() {
  const navigate  = useNavigate();
  const { id }    = useParams();              // reads :id from URL
  const user      = CURRENT_USER;

  // Fetch from dummy db by URL param
  const dossier = getDossierById(id);

  // Fallback if not found
  if (!dossier) {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
        <NavbarEnseignant active="dossiers" user={user} />
        <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
          <div style={{ fontSize: 64 }}>🔍</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.navyDark, margin: "16px 0 8px" }}>Dossier introuvable</div>
          <div style={{ color: C.gray600, marginBottom: 24 }}>Le dossier «{id}» n'existe pas ou ne vous appartient pas.</div>
          <button onClick={() => navigate("/ens/dossiers")} style={{ background: C.blue, color: C.white, border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}>← Mes dossiers</button>
        </div>
      </div>
    );
  }

  const cat      = CAT_CONFIG[dossier.categorie];
  const status   = STATUS_CONFIG[dossier.statut];
  const decision = dossier.decisionFinale ? DECISION_CONFIG[dossier.decisionFinale] : null;

  const timeline = [
    { date: dossier.dateDepot,     label: "Dossier soumis",                          done: true },
    { date: dossier.dateEnvoi,     label: "Transmis à la Direction Doctorale",       done: !!dossier.dateEnvoi },
    { date: dossier.dateEnvoi,     label: `Envoyé au ${dossier.csdAssigne || "CSD"}`,done: !!dossier.csdAssigne },
    { date: "—",                   label: "Évaluation par le CSD",                   done: ["csd_evalue","communique"].includes(dossier.statut) },
    { date: dossier.dateDecision,  label: "Décision communiquée",                    done: !!dossier.decisionFinale },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
      <NavbarEnseignant active="dossiers" user={user} />

      <div style={{ maxWidth: 960, margin: "32px auto", padding: "0 24px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: C.gray400 }}>
          <span onClick={() => navigate("/ens/dossiers")} style={{ color: C.blue, cursor: "pointer" }}>📂 Mes Dossiers</span>
          <span>›</span>
          <span style={{ color: C.navyDark, fontWeight: 600 }}>{dossier.titre}</span>
        </div>

        {/* Decision banner */}
        {decision && (
          <div style={{ background: decision.bg, border: `2px solid ${decision.color}30`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{decision.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: decision.color }}>{decision.label}</div>
                <div style={{ fontSize: 12, color: C.gray600 }}>Décision communiquée le {dossier.dateDecision}</div>
              </div>
            </div>
            {dossier.messageDirectrice && (
              <div style={{ fontSize: 14, color: C.gray600, lineHeight: 1.6, fontStyle: "italic", borderLeft: `3px solid ${C.gray200}`, paddingLeft: 14 }}>
                "{dossier.messageDirectrice}"
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
          {/* Left */}
          <div>
            {/* Dossier info card */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: C.navyDark, fontSize: 15 }}>{cat.icon} Informations du Dossier</div>
                <span style={{ background: status.bg, color: status.text, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{status.icon} {status.label}</span>
              </div>
              <div style={{ padding: "20px 24px" }}>
                {[
                  ["Référence",     dossier.id],
                  ["Titre",         dossier.titre],
                  ["Catégorie",     `${cat.icon} ${cat.label}`],
                  ["Date de dépôt", dossier.dateDepot],
                  ["Description",   dossier.description],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 140, fontSize: 13, fontWeight: 600, color: C.gray600, flexShrink: 0 }}>{l}</span>
                    <span style={{ fontSize: 14, color: C.navyDark }}>{v}</span>
                  </div>
                ))}
                {/* File */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.gray100, borderRadius: 10, padding: "14px 18px", marginTop: 8, cursor: "pointer" }}>
                  <span style={{ fontSize: 28 }}>📎</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{dossier.fichier}</div>
                    <div style={{ fontSize: 12, color: C.gray400 }}>{dossier.fichierSize}</div>
                  </div>
                  <button style={{ marginLeft: "auto", background: C.blue, color: C.white, border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>⬇ Télécharger</button>
                </div>
              </div>
            </div>

            {/* Confidentiality notice */}
            <div style={{ background: C.gray100, border: `1px dashed ${C.gray200}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.gray600, display: "flex", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>
                <strong>Évaluations confidentielles :</strong> Les détails des évaluations du CSD sont strictement confidentiels et ne sont pas accessibles depuis cet espace. Seule la décision finale de la Directrice est visible ici.
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div>
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, fontWeight: 700, color: C.navyDark, fontSize: 15 }}>📅 Historique</div>
              <div style={{ padding: "20px 24px" }}>
                {timeline.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < timeline.length - 1 ? 18 : 0, position: "relative" }}>
                    {i < timeline.length - 1 && <div style={{ position: "absolute", left: 14, top: 30, bottom: 0, width: 2, background: t.done ? C.green : C.gray200 }} />}
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.done ? C.green : C.gray200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: t.done ? C.white : C.gray400, flexShrink: 0 }}>
                      {t.done ? "✓" : i + 1}
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.navyDark }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: C.gray400 }}>{t.date || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/ens/dossiers")}
              style={{ width: "100%", background: C.white, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: "12px", fontWeight: 600, fontSize: 13, cursor: "pointer", textAlign: "center" }}
            >
              ← Retour à mes dossiers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

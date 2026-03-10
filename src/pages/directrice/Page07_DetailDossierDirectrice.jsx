// ─────────────────────────────────────────────────────────────────
// pages/Page07_DetailDossierDirectrice.jsx
// Route: /admin/dossiers/:id
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarDirectrice from "../../components/NavbarDirectrice";
import {C, STATUS_CONFIG, CAT_CONFIG } from "../../constants/theme";
import { DIRECTRICE, getDossierById, transferToCSD, communicateDecision } from "../../data/db";

const EVAL_CFG = {
  accepte:    { label: "Accepté",           color: C.green,  bg: C.greenLight,  icon: "✅" },
  refuse:     { label: "Refusé",            color: C.red,    bg: C.redLight,    icon: "❌" },
  corrections:{ label: "Corrections dem.",  color: C.yellow, bg: C.yellowLight, icon: "🔄" },
};

const DECISION_OPTIONS = [
  { value: "accepte",    label: "✅ Accepter le dossier" },
  { value: "refuse",     label: "❌ Refuser le dossier" },
  { value: "corrections",label: "🔄 Demander des corrections" },
];

export default function DetailDossierDirectrice() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [dossier,       setDossier]      = useState(getDossierById(id));
  const [showTransfer,  setShowTransfer] = useState(false);
  const [selectedCSD,   setSelectedCSD]  = useState("");
  const [decisionChosen,setDecisionChosen]= useState("");
  const [msgDecision,   setMsgDecision]  = useState("");
  const [toast,         setToast]        = useState(null);

  function showToast(msg, color = C.green) {
    setToast({ msg, color }); setTimeout(() => setToast(null), 3500);
  }

  if (!dossier) {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
        <NavbarDirectrice active="dossiers" user={DIRECTRICE} />
        <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
          <div style={{ fontSize: 64 }}>🔍</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.navyDark, margin: "16px 0 8px" }}>Dossier introuvable</div>
          <button onClick={() => navigate("/admin/dossiers")} style={{ background: C.blue, color: C.white, border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 600, cursor: "pointer", marginTop: 16 }}>← Tous les dossiers</button>
        </div>
      </div>
    );
  }

  const cat    = CAT_CONFIG[dossier.categorie];
  const status = STATUS_CONFIG[dossier.statut];

  function handleTransfer() {
    if (!selectedCSD) return;
    const updated = transferToCSD(dossier.id, selectedCSD);
    setDossier({ ...updated });
    setShowTransfer(false);
    showToast(`✅ Dossier transmis à ${selectedCSD}`);
  }

  function handleCommunicate() {
    if (!decisionChosen || !msgDecision.trim()) return;
    const updated = communicateDecision(dossier.id, decisionChosen, msgDecision);
    setDossier({ ...updated });
    showToast("✅ Décision communiquée à l'enseignant");
  }

  const timeline = [
    { date: dossier.dateDepot,    label: "Soumis par l'enseignant",               done: true },
    { date: dossier.dateEnvoi,    label: "Reçu par la Direction",                 done: true },
    { date: dossier.dateEnvoi,    label: `Transmis à ${dossier.csdAssigne||"CSD"}`,done: !!dossier.csdAssigne },
    { date: "—",                  label: "Évaluation par le CSD",                 done: ["csd_evalue","communique"].includes(dossier.statut) },
    { date: dossier.dateDecision, label: "Décision communiquée",                  done: !!dossier.decisionFinale },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
      {toast && <div style={{ position: "fixed", bottom: 28, right: 28, background: toast.color, color: C.white, borderRadius: 10, padding: "12px 20px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 1000 }}>{toast.msg}</div>}

      {/* Transfer Modal */}
      {showTransfer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowTransfer(false)}>
          <div style={{ background: C.white, borderRadius: 16, width: 440, boxShadow: "0 16px 48px rgba(0,0,0,0.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: C.navy, padding: "20px 24px", color: C.white }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>📤 Transférer au CSD</div>
              <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>Département de l'enseignant : <strong>{dossier.enseignant.departement}</strong></div>
            </div>
            <div style={{ padding: 24 }}>
              {["CSD Management", "CSD Finance & Comptabilité"].map(csd => (
                <div key={csd} onClick={() => setSelectedCSD(csd)} style={{ border: `2px solid ${selectedCSD === csd ? C.blue : C.gray200}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", marginBottom: 12, background: selectedCSD === csd ? C.bluePale : C.white, transition: "all .15s", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>👥</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{csd}</div>
                  </div>
                  {selectedCSD === csd && <span style={{ color: C.blue, fontWeight: 700 }}>✓</span>}
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setShowTransfer(false)} style={{ flex: 1, background: C.gray100, color: C.gray600, border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 600 }}>Annuler</button>
                <button onClick={handleTransfer} style={{ flex: 2, background: selectedCSD ? `linear-gradient(135deg,${C.blue},${C.blueLight})` : C.gray200, color: selectedCSD ? C.white : C.gray400, border: "none", borderRadius: 8, padding: "10px", cursor: selectedCSD ? "pointer" : "not-allowed", fontWeight: 700 }}>✅ Confirmer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <NavbarDirectrice active="dossiers" user={DIRECTRICE} />

      <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 24px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: C.gray400 }}>
          <span onClick={() => navigate("/admin/dossiers")} style={{ color: C.blue, cursor: "pointer" }}>📁 Tous les dossiers</span>
          <span>›</span>
          <span style={{ color: C.navyDark, fontWeight: 600 }}>{dossier.id}</span>
          <span style={{ marginLeft: "auto", background: status.bg, color: status.text, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{status.icon} {status.label}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
          {/* ── LEFT ── */}
          <div>
            {/* Enseignant */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 20, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: C.navyDark, fontSize: 15 }}>👤 Enseignant</div>
                <span style={{ fontSize: 12, color: C.teal, fontWeight: 600, background: "#D0F0F5", borderRadius: 6, padding: "3px 10px" }}>Dép. {dossier.enseignant.departement}</span>
              </div>
              <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", gap: 16, background: `linear-gradient(135deg,${C.navyDark},${C.navy})`, borderRadius: 12, padding: "16px 20px", color: C.white }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                    {dossier.enseignant.prenom[0]}{dossier.enseignant.nom[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{dossier.enseignant.prenom} {dossier.enseignant.nom}</div>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>{dossier.enseignant.grade} — {dossier.enseignant.departement}</div>
                    <div style={{ fontSize: 12, opacity: 0.65 }}>{dossier.enseignant.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dossier info */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 20, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, fontWeight: 700, color: C.navyDark, fontSize: 15 }}>{cat.icon} Informations du Dossier</div>
              <div style={{ padding: "20px 24px" }}>
                {[["Référence", dossier.id], ["Titre", dossier.titre], ["Catégorie", `${cat.icon} ${cat.label}`], ["Date de dépôt", dossier.dateDepot], ["CSD assigné", dossier.csdAssigne || "Non encore assigné"], ["Description", dossier.description]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 150, fontSize: 13, fontWeight: 600, color: C.gray600, flexShrink: 0 }}>{l}</span>
                    <span style={{ fontSize: 14, color: C.navyDark }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.gray100, borderRadius: 10, padding: "14px 18px", marginTop: 8 }}>
                  <span style={{ fontSize: 28 }}>📎</span>
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>{dossier.fichier}</div><div style={{ fontSize: 12, color: C.gray400 }}>{dossier.fichierSize}</div></div>
                  <button style={{ marginLeft: "auto", background: C.blue, color: C.white, border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>⬇ Télécharger</button>
                </div>
              </div>
            </div>

            {/* ── CONFIDENTIAL EVALUATIONS ── */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: C.navyDark, fontSize: 15 }}>🔒 Évaluations du CSD</div>
                <span style={{ background: C.purpleLight, color: C.purple, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>CONFIDENTIEL</span>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ background: C.purpleLight, border: `1.5px solid ${C.purple}30`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>🔐</span>
                  <div style={{ fontSize: 13, color: C.purple }}><strong>Informations confidentielles.</strong> Ces évaluations ne sont jamais visibles par l'enseignant.</div>
                </div>

                {dossier.evaluations.length === 0 ? (
                  <div style={{ textAlign: "center", color: C.gray400, fontSize: 14, padding: "24px 0" }}>Aucune évaluation reçue pour ce dossier.</div>
                ) : dossier.evaluations.map((ev, i) => (
                  <div key={i} style={{ border: `1.5px solid ${ev.decision ? EVAL_CFG[ev.decision]?.color + "30" : C.gray200}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12, background: ev.decision ? EVAL_CFG[ev.decision]?.bg + "60" : C.gray100 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.navyDark }}>{ev.membre}</div>
                        <div style={{ fontSize: 12, color: C.gray400 }}>Rôle : {ev.role}{ev.date ? ` · ${ev.date}` : ""}</div>
                      </div>
                      {ev.decision
                        ? <span style={{ background: EVAL_CFG[ev.decision].bg, color: EVAL_CFG[ev.decision].color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{EVAL_CFG[ev.decision].icon} {EVAL_CFG[ev.decision].label}</span>
                        : <span style={{ background: C.gray200, color: C.gray600, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>👁 Consultation</span>
                      }
                    </div>
                    {ev.commentaire && <div style={{ fontSize: 13, color: C.gray600, background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 14px", fontStyle: "italic", borderLeft: `3px solid ${C.gray200}` }}>"{ev.commentaire}"</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div>
            {/* Transfer button */}
            {!["envoye_csd","en_evaluation","csd_evalue","communique"].includes(dossier.statut) && (
              <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: C.navyDark, fontSize: 15, marginBottom: 12 }}>📤 Transfert au CSD</div>
                <button onClick={() => setShowTransfer(true)} style={{ background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: C.white, border: "none", borderRadius: 8, padding: "12px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 8px rgba(26,111,168,0.3)", width: "100%" }}>
                  📤 Transférer au CSD
                </button>
              </div>
            )}

            {dossier.csdAssigne && dossier.statut !== "communique" && (
              <div style={{ background: C.bluePale, border: `2px solid ${C.blue}30`, borderRadius: 12, padding: "14px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: C.gray600, marginBottom: 4 }}>CSD assigné</div>
                <div style={{ fontWeight: 700, color: C.blue, fontSize: 14 }}>👥 {dossier.csdAssigne}</div>
              </div>
            )}

            {/* Decision form */}
            {["csd_evalue","en_evaluation"].includes(dossier.statut) && (
              <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: C.navyDark, fontSize: 15, marginBottom: 4 }}>📋 Communiquer la Décision</div>
                <div style={{ fontSize: 12, color: C.gray600, marginBottom: 16 }}>Visible par l'enseignant. Les évaluations CSD restent confidentielles.</div>
                {DECISION_OPTIONS.map(opt => (
                  <div key={opt.value} onClick={() => setDecisionChosen(opt.value)} style={{ border: `2px solid ${decisionChosen === opt.value ? C.navy : C.gray200}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", marginBottom: 10, background: decisionChosen === opt.value ? C.navy : C.white, color: decisionChosen === opt.value ? C.white : C.navyDark, display: "flex", justifyContent: "space-between", fontWeight: decisionChosen === opt.value ? 700 : 500, transition: "all .15s", fontSize: 13 }}>
                    <span>{opt.label}</span>
                    {decisionChosen === opt.value && <span>✓</span>}
                  </div>
                ))}
                <textarea
                  value={msgDecision}
                  onChange={e => setMsgDecision(e.target.value)}
                  placeholder="Message à communiquer à l'enseignant..."
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${C.gray200}`, fontSize: 13, resize: "vertical", minHeight: 100, boxSizing: "border-box", marginTop: 4, outline: "none", fontFamily: "inherit" }}
                />
                <button
                  onClick={handleCommunicate}
                  disabled={!decisionChosen || !msgDecision.trim()}
                  style={{ background: decisionChosen && msgDecision.trim() ? `linear-gradient(135deg,${C.green},#22c55e)` : C.gray200, color: decisionChosen && msgDecision.trim() ? C.white : C.gray400, border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 14, cursor: decisionChosen && msgDecision.trim() ? "pointer" : "not-allowed", width: "100%", marginTop: 12 }}
                >
                  📬 Communiquer la décision
                </button>
              </div>
            )}

            {dossier.statut === "communique" && (
              <div style={{ background: C.greenLight, border: `2px solid ${C.green}30`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
                <div style={{ fontWeight: 800, color: C.green, fontSize: 15 }}>Décision communiquée</div>
                <div style={{ fontSize: 13, color: C.gray600, marginTop: 4 }}>L'enseignant a été notifié le {dossier.dateDecision}.</div>
              </div>
            )}

            {/* Timeline */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, fontWeight: 700, color: C.navyDark, fontSize: 15 }}>📅 Historique</div>
              <div style={{ padding: "20px 24px" }}>
                {timeline.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < timeline.length - 1 ? 16 : 0, position: "relative" }}>
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

            <button onClick={() => navigate("/admin/dossiers")} style={{ width: "100%", background: C.white, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: "12px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              ← Retour aux dossiers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

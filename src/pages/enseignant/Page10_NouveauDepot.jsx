// ─────────────────────────────────────────────────────────────────
// pages/Page10_NouveauDepot.jsx
// Route: /ens/depot
// ─────────────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavbarEnseignant from "../../components/NavbarEnseignant";
import { C, CAT_CONFIG } from "../../constants/theme";
import { CURRENT_USER, submitDossier } from "../../data/db";

const CATEGORIES = Object.entries(CAT_CONFIG).map(([id, cfg]) => ({ id, ...cfg }));
const STEPS = ["Catégorie", "Document", "Récapitulatif"];

export default function NouveauDepot() {
  const navigate  = useNavigate();
  const user      = CURRENT_USER;
  const fileRef   = useRef();

  const [step,        setStep]        = useState(0);
  const [categorie,   setCategorie]   = useState(null);
  const [titre,       setTitre]       = useState("");
  const [description, setDescription] = useState("");
  const [file,        setFile]        = useState(null);
  const [dragOver,    setDragOver]    = useState(false);
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [newDossierId,setNewDossierId]= useState(null);

  const selectedCat = CATEGORIES.find(c => c.id === categorie);

  function handleNext() {
    if (step === 0) {
      if (!categorie) { setErrors({ categorie: "Sélectionnez une catégorie." }); return; }
    }
    if (step === 1) {
      const e = {};
      if (!titre.trim()) e.titre = "Le titre est obligatoire.";
      if (!file)         e.file  = "Veuillez joindre un fichier.";
      if (Object.keys(e).length > 0) { setErrors(e); return; }
    }
    setErrors({});
    setStep(s => s + 1);
  }

  function handleSubmit() {
    // Save to dummy db
    const newDossier = submitDossier({
      titre, description, categorie,
      fichier: file?.name || "document.pdf",
      fichierSize: file ? `${(file.size / 1024 / 1024).toFixed(1)} Mo` : "—",
    });
    setNewDossierId(newDossier.id);
    setSubmitted(true);
  }

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 14, boxSizing: "border-box",
    border: `1.5px solid ${err ? C.red : C.gray200}`, outline: "none", background: C.white, fontFamily: "inherit",
  });

  if (submitted) {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
        <NavbarEnseignant active="depot" user={user} />
        <div style={{ maxWidth: 640, margin: "60px auto", padding: "0 24px" }}>
          <div style={{ background: C.white, borderRadius: 20, padding: "56px 40px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.green, marginBottom: 8 }}>Dossier soumis avec succès !</div>
            <div style={{ color: C.gray600, fontSize: 15, marginBottom: 6 }}>
              Votre dossier <strong>«{titre}»</strong> a été transmis à la Direction Doctorale.
            </div>
            <div style={{ fontSize: 13, color: C.gray400, marginBottom: 32 }}>Référence : <strong>{newDossierId}</strong></div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => navigate("/ens/dossiers")}
                style={{ background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: C.white, border: "none", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                📂 Voir mes dossiers
              </button>
              <button
                onClick={() => { setSubmitted(false); setStep(0); setCategorie(null); setTitre(""); setDescription(""); setFile(null); }}
                style={{ background: C.white, color: C.blue, border: `2px solid ${C.blue}`, borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                + Nouveau dépôt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
      <NavbarEnseignant active="depot" user={user} />

      <div style={{ maxWidth: 860, margin: "40px auto", padding: "0 24px" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.navyDark, marginBottom: 4 }}>📤 Nouveau Dépôt</div>
        <div style={{ color: C.gray600, fontSize: 14, marginBottom: 32 }}>Soumettez un document à la Direction Doctorale pour évaluation.</div>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, background: i < step ? C.green : i === step ? C.blue : C.gray200, color: i <= step ? C.white : C.gray400, transition: "all .2s" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: i === step ? 700 : 400, color: i === step ? C.blue : i < step ? C.green : C.gray400 }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? C.green : C.gray200, margin: "0 12px" }} />}
            </div>
          ))}
        </div>

        <div style={{ background: C.white, borderRadius: 16, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>

          {/* STEP 0 — Category */}
          {step === 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.navyDark, marginBottom: 20 }}>Choisissez la catégorie du document</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                {CATEGORIES.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => { setCategorie(cat.id); setErrors({}); }}
                    style={{ border: `2px solid ${categorie === cat.id ? C.blue : C.gray200}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", background: categorie === cat.id ? C.bluePale : C.white, transition: "all .15s", textAlign: "center", boxShadow: categorie === cat.id ? "0 4px 16px rgba(26,111,168,0.15)" : "0 2px 6px rgba(0,0,0,0.04)", transform: categorie === cat.id ? "translateY(-2px)" : "none" }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{cat.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: categorie === cat.id ? C.blue : C.navyDark, marginBottom: 4 }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: C.gray600 }}>Formats : {cat.formats}</div>
                  </div>
                ))}
              </div>
              {errors.categorie && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>⚠ {errors.categorie}</div>}
              <button onClick={handleNext} style={{ background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: C.white, border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Suivant →</button>
            </>
          )}

          {/* STEP 1 — Document info */}
          {step === 1 && (
            <>
              {/* Profile strip */}
              <div style={{ display: "flex", gap: 24, background: `linear-gradient(135deg,${C.navyDark},${C.blue})`, borderRadius: 12, padding: "14px 20px", color: C.white, marginBottom: 24 }}>
                {[["Enseignant", `${user.prenom} ${user.nom}`], ["Grade", user.grade], ["Département", user.departement], ["Catégorie", selectedCat?.label]].map(([l, v]) => (
                  <div key={l} style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Titre */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.navyDark, display: "block", marginBottom: 6 }}>Titre du document <span style={{ color: C.red }}>*</span></label>
                <input style={inputStyle(errors.titre)} value={titre} onChange={e => { setTitre(e.target.value); setErrors(p => ({ ...p, titre: null })); }} placeholder="Ex : Introduction au Management des Organisations" />
                {errors.titre && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>⚠ {errors.titre}</div>}
              </div>

              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.navyDark, display: "block", marginBottom: 6 }}>Description <span style={{ fontSize: 12, color: C.gray400, fontWeight: 400 }}>(optionnel)</span></label>
                <textarea style={{ ...inputStyle(false), minHeight: 90, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Décrivez brièvement le contenu du document..." />
              </div>

              {/* File drop */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.navyDark, display: "block", marginBottom: 6 }}>Fichier <span style={{ color: C.red }}>*</span> — {selectedCat?.formats}</label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setErrors(p => ({ ...p, file: null })); } }}
                  onClick={() => fileRef.current.click()}
                  style={{ border: `2px dashed ${errors.file ? C.red : dragOver ? C.blue : C.gray200}`, borderRadius: 12, padding: "32px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? C.bluePale : C.gray100, transition: "all .15s" }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📎</div>
                  {file
                    ? <><div style={{ fontWeight: 700, color: C.green, fontSize: 14 }}>✅ {file.name}</div><div style={{ fontSize: 12, color: C.gray400 }}>{(file.size / 1024 / 1024).toFixed(2)} Mo</div></>
                    : <><div style={{ fontWeight: 600, fontSize: 14, color: C.navyDark }}>Glissez votre fichier ici</div><div style={{ fontSize: 12, color: C.gray400 }}>ou cliquez pour parcourir — {selectedCat?.formats}</div></>
                  }
                  <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) { setFile(e.target.files[0]); setErrors(p => ({ ...p, file: null })); } }} />
                </div>
                {errors.file && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>⚠ {errors.file}</div>}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(0)} style={{ background: C.white, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: "12px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Retour</button>
                <button onClick={handleNext} style={{ background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: C.white, border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Voir le récapitulatif →</button>
              </div>
            </>
          )}

          {/* STEP 2 — Recap */}
          {step === 2 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.navyDark, marginBottom: 20 }}>Récapitulatif — vérifiez avant de soumettre</div>
              {[
                ["Enseignant",   `${user.prenom} ${user.nom} — ${user.grade}`],
                ["Département",  user.departement],
                ["Catégorie",    `${selectedCat?.icon} ${selectedCat?.label}`],
                ["Titre",        titre],
                ["Description",  description || "—"],
                ["Fichier joint",file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} Mo)` : "—"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: `1px solid ${C.gray100}`, alignItems: "flex-start" }}>
                  <span style={{ width: 140, fontSize: 13, fontWeight: 600, color: C.gray600, flexShrink: 0 }}>{l}</span>
                  <span style={{ fontSize: 14, color: C.navyDark }}>{v}</span>
                </div>
              ))}
              <div style={{ background: C.bluePale, borderRadius: 10, padding: "12px 16px", marginTop: 20, fontSize: 13, color: C.blue }}>
                ℹ Après soumission, votre dossier sera transmis à la Directrice Doctorale. Vous serez notifié de la décision.
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={() => setStep(1)} style={{ background: C.white, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: "12px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Modifier</button>
                <button onClick={handleSubmit} style={{ background: `linear-gradient(135deg,${C.green},#22c55e)`, color: C.white, border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>✅ Soumettre le dossier</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// pages/Page13_MonProfil.jsx
// Route: /ens/profil
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarEnseignant from "../../components/NavbarEnseignant";
import { C } from "../../constants/theme";
import { CURRENT_USER, getDossiersForUser } from "../../data/db";

const GRADES = ["Professeur","Maître de Conférences A","Maître de Conférences B","Maître Assistant A","Maître Assistant B","Attaché d'Enseignement"];

export default function MonProfil() {
  const navigate = useNavigate();
  const user     = CURRENT_USER;
  const dossiers = getDossiersForUser(user.id);

  const [tab,     setTab]     = useState("info");
  const [editing, setEditing] = useState(false);
  const [toast,   setToast]   = useState(null);

  const [form,  setForm]  = useState({ nom: user.nom, prenom: user.prenom, grade: user.grade, telephone: user.telephone, specialite: user.specialite });
  const [draft, setDraft] = useState({ ...form });

  const [pwForm,   setPwForm]   = useState({ old: "", newPw: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});

  function showToast(msg, color = C.green) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSave() {
    setForm({ ...draft });
    setEditing(false);
    showToast("✅ Profil mis à jour avec succès");
  }

  function handlePwSave() {
    const e = {};
    if (!pwForm.old)              e.old     = "Requis";
    if (pwForm.newPw.length < 8)  e.newPw   = "8 caractères minimum";
    if (pwForm.newPw !== pwForm.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setPwErrors(e);
    if (Object.keys(e).length === 0) {
      setPwForm({ old: "", newPw: "", confirm: "" });
      showToast("✅ Mot de passe modifié avec succès");
    }
  }

  const inputStyle = (disabled, err) => ({
    width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14, boxSizing: "border-box",
    border: `1.5px solid ${err ? C.red : disabled ? C.gray100 : C.gray200}`,
    background: disabled ? C.gray100 : C.white,
    color: disabled ? C.gray400 : C.navyDark,
    outline: "none", fontFamily: "inherit",
  });

  const statsCount = {
    total:   dossiers.length,
    accepte: dossiers.filter(d => d.decisionFinale === "accepte").length,
    enCours: dossiers.filter(d => ["soumis","evaluation","envoye_csd","csd_evalue"].includes(d.statut)).length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: toast.color, color: C.white, borderRadius: 10, padding: "12px 20px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 1000, display: "flex", alignItems: "center", gap: 8 }}>
          {toast.msg}
        </div>
      )}

      <NavbarEnseignant active="profil" user={user} />

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>

        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, ${C.navyDark}, ${C.navy} 60%, ${C.blue})`, borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", gap: 24, marginBottom: 28, color: C.white, boxShadow: "0 8px 24px rgba(13,33,55,0.18)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
            {user.initiales}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{form.prenom} {form.nom}</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>{user.email}</div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.2)", marginTop: 8 }}>
              🎓 {form.grade} — Dép. {user.departement}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
            {[["Dossiers", statsCount.total], ["Acceptés", statsCount.accepte], ["En cours", statsCount.enCours]].map(([lbl, num]) => (
              <div key={lbl} style={{ textAlign: "center", background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 20px", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{num}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: `2px solid ${C.gray200}`, marginBottom: 24 }}>
          {[{ id: "info", label: "👤 Informations personnelles" }, { id: "password", label: "🔒 Changer le mot de passe" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 24px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.blue : C.gray600, borderBottom: tab === t.id ? `2px solid ${C.blue}` : "2px solid transparent", marginBottom: -2, borderRadius: "4px 4px 0 0", fontFamily: "inherit" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Info */}
        {tab === "info" && (
          <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: C.navyDark, fontSize: 15 }}>👤 Informations personnelles</div>
              {!editing && <button onClick={() => setEditing(true)} style={{ background: C.bluePale, color: C.blue, border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>✏ Modifier</button>}
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { key: "nom",    label: "Nom",     editable: true },
                  { key: "prenom", label: "Prénom",  editable: true },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 6 }}>{f.label} <span style={{ color: C.red }}>*</span></label>
                    <input style={inputStyle(!editing || !f.editable)} value={draft[f.key]} disabled={!editing} onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}

                {/* Grade */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 6 }}>Grade <span style={{ color: C.red }}>*</span></label>
                  <select style={{ ...inputStyle(!editing), cursor: editing ? "pointer" : "default" }} value={draft.grade} disabled={!editing} onChange={e => setDraft(p => ({ ...p, grade: e.target.value }))}>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                {/* Département — locked */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 6 }}>Département</label>
                  <input style={inputStyle(true)} value={user.departement} disabled />
                  <span style={{ fontSize: 11, color: C.gray400, display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>🔒 Non modifiable — contactez la Directrice</span>
                </div>

                {/* Email — locked */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 6 }}>E-mail universitaire</label>
                  <input style={inputStyle(true)} value={user.email} disabled />
                  <span style={{ fontSize: 11, color: C.gray400, display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>🔒 E-mail institutionnel non modifiable</span>
                </div>

                {/* Téléphone */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 6 }}>Téléphone</label>
                  <input style={inputStyle(!editing)} value={draft.telephone} disabled={!editing} onChange={e => setDraft(p => ({ ...p, telephone: e.target.value }))} placeholder="+213 xxx xx xx xx" />
                </div>

                {/* Spécialité - full width */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 6 }}>Spécialité / Domaine de recherche</label>
                  <input style={inputStyle(!editing)} value={draft.specialite} disabled={!editing} onChange={e => setDraft(p => ({ ...p, specialite: e.target.value }))} placeholder="Ex : Management des Organisations" />
                </div>
              </div>

              {editing && (
                <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.gray100}` }}>
                  <button onClick={() => { setDraft({ ...form }); setEditing(false); }} style={{ background: C.white, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Annuler</button>
                  <button onClick={handleSave} style={{ background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: C.white, border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>✅ Enregistrer</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Password */}
        {tab === "password" && (
          <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.gray100}`, fontWeight: 700, color: C.navyDark, fontSize: 15 }}>🔒 Changer le mot de passe</div>
            <div style={{ padding: 24, maxWidth: 480 }}>
              {[
                { key: "old",     label: "Mot de passe actuel",               ph: "Entrez votre mot de passe actuel" },
                { key: "newPw",   label: "Nouveau mot de passe",              ph: "8 caractères minimum" },
                { key: "confirm", label: "Confirmer le nouveau mot de passe", ph: "Répétez le nouveau mot de passe" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 6 }}>{f.label} <span style={{ color: C.red }}>*</span></label>
                  <input type="password" style={inputStyle(false, !!pwErrors[f.key])} value={pwForm[f.key]} placeholder={f.ph} onChange={e => { setPwForm(p => ({ ...p, [f.key]: e.target.value })); setPwErrors(p => ({ ...p, [f.key]: null })); }} />
                  {pwErrors[f.key] && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>⚠ {pwErrors[f.key]}</div>}
                </div>
              ))}
              <div style={{ background: C.bluePale, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.blue, marginBottom: 20 }}>
                ℹ Le mot de passe doit contenir au minimum 8 caractères.
              </div>
              <button onClick={handlePwSave} style={{ background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: C.white, border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                🔒 Modifier le mot de passe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

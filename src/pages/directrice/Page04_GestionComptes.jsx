// ─────────────────────────────────────────────────────────────────
// pages/Page04_GestionComptes.jsx
// Route: /admin/users
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDirectrice from "../../components/NavbarDirectrice";
import { C } from "../../constants/theme";
import { DIRECTRICE, USERS, activateUser, deactivateUser } from "../../data/db";

const STATUS_CFG = {
  actif:   { label: "Actif",                   bg: C.greenLight,   text: C.green,  dot: C.green  },
  attente: { label: "En attente d'activation", bg: C.orangeLight,  text: C.orange, dot: C.orange },
  inactif: { label: "Inactif",                 bg: C.gray200,      text: C.gray600,dot: C.gray400 },
};

export default function GestionComptes() {
  const navigate = useNavigate();

  const [users,        setUsers]        = useState(USERS);
  const [filterStatut, setFilterStatut] = useState("tous");
  const [filterDept,   setFilterDept]   = useState("tous");
  const [search,       setSearch]       = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast,        setToast]        = useState(null);

  function showToast(msg, color = C.green) {
    setToast({ msg, color }); setTimeout(() => setToast(null), 3200);
  }

  function handleActivate(id) {
    activateUser(id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, statut: "actif" } : u));
    showToast("✅ Compte activé — l'enseignant a été notifié");
  }
  function handleDeactivate(id) {
    deactivateUser(id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, statut: "inactif" } : u));
    showToast("⚠ Compte désactivé", C.orange);
  }
  function handleReactivate(id) {
    activateUser(id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, statut: "actif" } : u));
    showToast("✅ Compte réactivé");
  }

  const depts    = ["tous", ...new Set(USERS.map(u => u.departement))];
  const filtered = users.filter(u => {
    const matchS = filterStatut === "tous" || u.statut === filterStatut;
    const matchD = filterDept   === "tous" || u.departement === filterDept;
    const matchQ = !search || `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    return matchS && matchD && matchQ;
  });

  const counts = { tous: users.length, actif: users.filter(u => u.statut === "actif").length, attente: users.filter(u => u.statut === "attente").length, inactif: users.filter(u => u.statut === "inactif").length };

  const th = { background: C.navy, color: C.white, padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" };
  const td = { padding: "13px 16px", fontSize: 13, color: C.navyDark, verticalAlign: "middle" };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.offWhite, minHeight: "100vh" }}>
      {toast && <div style={{ position: "fixed", bottom: 28, right: 28, background: toast.color, color: C.white, borderRadius: 10, padding: "12px 20px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 1000 }}>{toast.msg}</div>}

      {/* Modal */}
      {selectedUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelectedUser(null)}>
          <div style={{ background: C.white, borderRadius: 16, width: 480, boxShadow: "0 16px 48px rgba(0,0,0,0.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: C.navy, padding: "20px 24px", color: C.white }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{selectedUser.prenom} {selectedUser.nom}</div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>{selectedUser.grade} — {selectedUser.departement}</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {[["E-mail", selectedUser.email], ["Département", selectedUser.departement], ["Grade", selectedUser.grade], ["Dossiers soumis", selectedUser.nbDossiers], ["Inscription", selectedUser.dateInscription], ["Statut", STATUS_CFG[selectedUser.statut].label]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.gray100}`, fontSize: 14 }}>
                  <span style={{ width: 140, fontWeight: 600, color: C.gray600, flexShrink: 0 }}>{l}</span>
                  <span style={{ color: C.navyDark }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, padding: "16px 24px", borderTop: `1px solid ${C.gray100}`, justifyContent: "flex-end" }}>
              {selectedUser.statut === "attente" && <button onClick={() => { handleActivate(selectedUser.id); setSelectedUser(null); }} style={{ background: C.green, color: C.white, border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>✅ Activer</button>}
              {selectedUser.statut === "actif"   && <button onClick={() => { handleDeactivate(selectedUser.id); setSelectedUser(null); }} style={{ background: C.red,   color: C.white, border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>⛔ Désactiver</button>}
              {selectedUser.statut === "inactif" && <button onClick={() => { handleReactivate(selectedUser.id); setSelectedUser(null); }} style={{ background: C.blue,  color: C.white, border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🔄 Réactiver</button>}
              <button onClick={() => setSelectedUser(null)} style={{ background: C.gray100, color: C.gray600, border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontWeight: 600 }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      <NavbarDirectrice active="users" user={DIRECTRICE} />

      <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 24px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.navyDark, marginBottom: 4 }}>👥 Gestion des Comptes Enseignants</div>
        <div style={{ color: C.gray600, fontSize: 13, marginBottom: 24 }}>Activez, désactivez ou consultez les comptes des enseignants inscrits.</div>

        {/* Status tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[{ id: "tous", label: `Tous (${counts.tous})` }, { id: "attente", label: `En attente (${counts.attente})` }, { id: "actif", label: `Actifs (${counts.actif})` }, { id: "inactif", label: `Inactifs (${counts.inactif})` }].map(t => (
            <button key={t.id} onClick={() => setFilterStatut(t.id)} style={{ padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: filterStatut === t.id ? 700 : 500, background: filterStatut === t.id ? C.navy : C.white, color: filterStatut === t.id ? C.white : C.gray600, boxShadow: filterStatut === t.id ? "0 2px 8px rgba(26,58,92,0.2)" : "0 1px 3px rgba(0,0,0,0.06)" }}>
              {t.id === "attente" && counts.attente > 0 ? `🔔 ${t.label}` : t.label}
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.gray400 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom ou e-mail..." style={{ padding: "9px 14px 9px 34px", borderRadius: 8, border: `1.5px solid ${C.gray200}`, fontSize: 13, outline: "none", background: C.white, width: 240 }} />
          </div>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.gray200}`, fontSize: 13, background: C.white, outline: "none" }}>
            {depts.map(d => <option key={d} value={d}>{d === "tous" ? "Tous les départements" : d}</option>)}
          </select>
          <span style={{ color: C.gray400, fontSize: 13, marginLeft: "auto" }}>{filtered.length} résultat(s)</span>
        </div>

        {/* Table */}
        <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Enseignant","Grade","Département","E-mail","Statut","Dossiers","Inscription","Actions"].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: C.gray400, fontSize: 14 }}>Aucun résultat.</td></tr>
              ) : filtered.map((u, i) => {
                const st = STATUS_CFG[u.statut];
                return (
                  <tr key={u.id} style={{ background: i % 2 === 1 ? C.offWhite : C.white, borderBottom: `1px solid ${C.gray100}` }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bluePale + "60"}
                    onMouseLeave={e => e.currentTarget.style.background = i%2===1 ? C.offWhite : C.white}
                  >
                    <td style={td}><div style={{ fontWeight: 600 }}>{u.prenom} {u.nom}</div></td>
                    <td style={{ ...td, color: C.gray600, fontSize: 12 }}>{u.grade}</td>
                    <td style={td}>{u.departement}</td>
                    <td style={{ ...td, fontSize: 12, color: C.gray600 }}>{u.email}</td>
                    <td style={td}>
                      <span style={{ background: st.bg, color: st.text, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />{st.label}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: "center", fontWeight: 700, color: C.blue }}>{u.nbDossiers}</td>
                    <td style={{ ...td, fontSize: 12, color: C.gray400 }}>{u.dateInscription}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setSelectedUser(u)} style={{ background: C.bluePale, color: C.blue, border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Voir</button>
                        {u.statut === "attente" && <button onClick={() => handleActivate(u.id)}   style={{ background: C.greenLight, color: C.green, border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Activer</button>}
                        {u.statut === "actif"   && <button onClick={() => handleDeactivate(u.id)} style={{ background: C.redLight,   color: C.red,   border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Désactiver</button>}
                        {u.statut === "inactif" && <button onClick={() => handleReactivate(u.id)} style={{ background: C.bluePale,  color: C.teal,  border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Réactiver</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

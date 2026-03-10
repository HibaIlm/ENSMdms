// ─────────────────────────────────────────────────────────────────
// data/db.js  —  Dummy data layer
//
// HOW TO SWAP WITH A REAL DATABASE LATER:
//   Each exported object has the same shape your API should return.
//   When you connect a backend, replace the contents of each export
//   with an API call (fetch/axios) and the rest of the app won't
//   need to change at all.
//
//   Example replacement:
//     export const getCurrentUser = async () => {
//       const res = await fetch('/api/auth/me');
//       return res.json();
//     };
// ─────────────────────────────────────────────────────────────────

// ── Currently logged-in user ──────────────────────────────────────
// roles: "enseignant" | "directrice" | "csd"
export const CURRENT_USER = {
  id: "u001",
  nom: "Mohamed El Hadj",
  prenom: "Leila",
  initiales: "MH",
  email: "l.mohamedelhadj@ensmanagement.edu.dz",
  grade: "Professeur",
  departement: "Management",
  telephone: "+213 555 12 34 56",
  specialite: "Management des Organisations",
  role: "enseignant",       // ← change to "directrice" or "csd" to test those views
  statut: "actif",
  dateInscription: "2025-01-10",
};

// ── Directrice (admin) user ───────────────────────────────────────
export const DIRECTRICE = {
  id: "u000",
  nom: "Dr. Directrice",
  prenom: "",
  initiales: "DD",
  email: "direction@ensm.dz",
  role: "directrice",
};

// ── All enseignant accounts ───────────────────────────────────────
export let USERS = [
  { id: "u001", nom: "Ben Moussa",  prenom: "Karim",  grade: "Professeur",             departement: "Management",    email: "k.benmoussa@ensm.dz",  statut: "actif",   dateInscription: "2025-01-10", nbDossiers: 4 },
  { id: "u002", nom: "Zidane",      prenom: "Sofiane", grade: "Maître de Conférences A", departement: "Finance",       email: "s.zidane@ensm.dz",      statut: "attente", dateInscription: "2025-03-05", nbDossiers: 0 },
  { id: "u003", nom: "Hamidi",      prenom: "Nadia",  grade: "Professeur",             departement: "Management",    email: "n.hamidi@ensm.dz",      statut: "actif",   dateInscription: "2025-01-22", nbDossiers: 2 },
  { id: "u004", nom: "Lounis",      prenom: "Djamel", grade: "Maître de Conférences B", departement: "Comptabilité",  email: "d.lounis@ensm.dz",      statut: "attente", dateInscription: "2025-03-07", nbDossiers: 0 },
  { id: "u005", nom: "Mebarki",     prenom: "Sara",   grade: "Maître Assistant A",      departement: "Finance",       email: "s.mebarki@ensm.dz",     statut: "actif",   dateInscription: "2025-02-01", nbDossiers: 1 },
  { id: "u006", nom: "Ouali",       prenom: "Tarek",  grade: "Maître de Conférences A", departement: "Comptabilité",  email: "t.ouali@ensm.dz",       statut: "inactif", dateInscription: "2024-12-15", nbDossiers: 0 },
];

// ── CSD Members ───────────────────────────────────────────────────
export const CSD_MEMBERS = [
  { id: "c001", nom: "Dr. Aissaoui Farida",   csd: "CSD Management",           role: "Validation"   },
  { id: "c002", nom: "Pr. Khelil Mourad",     csd: "CSD Management",           role: "Validation"   },
  { id: "c003", nom: "Dr. Boumediene Amira",  csd: "CSD Management",           role: "Consultation" },
  { id: "c004", nom: "Dr. Benali Farouk",     csd: "CSD Finance & Comptabilité", role: "Validation" },
  { id: "c005", nom: "Pr. Cherif Malika",     csd: "CSD Finance & Comptabilité", role: "Consultation" },
];

// ── Dossiers ──────────────────────────────────────────────────────
export let DOSSIERS = [
  {
    id: "DOS-2025-042",
    enseignantId: "u001",
    enseignant: { nom: "Ben Moussa", prenom: "Karim", grade: "Professeur", departement: "Management", email: "k.benmoussa@ensm.dz" },
    titre: "Introduction au Management des Organisations",
    categorie: "cours",
    description: "Ce cours couvre les fondamentaux du management des organisations, incluant les théories classiques et contemporaines, la structure organisationnelle et la prise de décision stratégique.",
    fichier: "Management_Organisations_CM.pdf",
    fichierSize: "2.4 Mo",
    statut: "csd_evalue",
    csdAssigne: "CSD Management",
    dateDepot: "2025-03-01",
    dateEnvoi: "2025-03-03",
    dateDecision: null,
    decisionFinale: null,
    messageDirectrice: null,
    evaluations: [
      { membreId: "c001", membre: "Dr. Aissaoui Farida",  role: "Validation",   decision: "accepte",    commentaire: "Cours très bien structuré, références bibliographiques solides. La progression pédagogique est claire et adaptée au niveau doctoral.", date: "2025-03-05" },
      { membreId: "c002", membre: "Pr. Khelil Mourad",   role: "Validation",   decision: "corrections", commentaire: "Contenu de bonne qualité mais quelques sections manquent de profondeur. Recommande d'enrichir la partie sur les théories contemporaines.", date: "2025-03-06" },
      { membreId: "c003", membre: "Dr. Boumediene Amira", role: "Consultation", decision: null,          commentaire: null, date: null },
    ],
  },
  {
    id: "DOS-2025-038",
    enseignantId: "u001",
    enseignant: { nom: "Ben Moussa", prenom: "Karim", grade: "Professeur", departement: "Management", email: "k.benmoussa@ensm.dz" },
    titre: "Impact de la gouvernance sur la performance",
    categorie: "publication",
    description: "Article de recherche analysant l'impact des mécanismes de gouvernance sur la performance des entreprises algériennes.",
    fichier: "Gouvernance_Performance_2025.pdf",
    fichierSize: "1.1 Mo",
    statut: "communique",
    csdAssigne: "CSD Management",
    dateDepot: "2025-02-18",
    dateEnvoi: "2025-02-20",
    dateDecision: "2025-02-28",
    decisionFinale: "accepte",
    messageDirectrice: "Votre publication a été évaluée favorablement par le Comité Scientifique. Félicitations pour la qualité de votre travail de recherche.",
    evaluations: [],
  },
  {
    id: "DOS-2025-031",
    enseignantId: "u001",
    enseignant: { nom: "Ben Moussa", prenom: "Karim", grade: "Professeur", departement: "Management", email: "k.benmoussa@ensm.dz" },
    titre: "Manuel de Gestion Financière",
    categorie: "ouvrage",
    description: "Manuel pédagogique destiné aux étudiants de licence et master en sciences de gestion.",
    fichier: "Manuel_Gestion_Financiere.pdf",
    fichierSize: "5.7 Mo",
    statut: "soumis",
    csdAssigne: null,
    dateDepot: "2025-02-05",
    dateEnvoi: null,
    dateDecision: null,
    decisionFinale: null,
    messageDirectrice: null,
    evaluations: [],
  },
  {
    id: "DOS-2025-019",
    enseignantId: "u001",
    enseignant: { nom: "Ben Moussa", prenom: "Karim", grade: "Professeur", departement: "Management", email: "k.benmoussa@ensm.dz" },
    titre: "Cours de Macroéconomie Appliquée",
    categorie: "cours",
    description: "Support de cours pour l'enseignement de la macroéconomie appliquée.",
    fichier: "Macroeconomie_Appliquee_CM.pdf",
    fichierSize: "3.2 Mo",
    statut: "communique",
    csdAssigne: "CSD Management",
    dateDepot: "2025-01-22",
    dateEnvoi: "2025-01-24",
    dateDecision: "2025-02-01",
    decisionFinale: "refuse",
    messageDirectrice: "Après évaluation par le CSD, ce cours ne répond pas aux critères requis pour la plateforme doctorale. Vous pouvez soumettre une version révisée.",
    evaluations: [],
  },
  {
    id: "DOS-2025-045",
    enseignantId: "u003",
    enseignant: { nom: "Hamidi", prenom: "Nadia", grade: "Professeur", departement: "Management", email: "n.hamidi@ensm.dz" },
    titre: "Stratégie d'entreprise et compétitivité",
    categorie: "cours",
    description: "Cours doctoral sur les approches stratégiques modernes.",
    fichier: "Strategie_Competitivite.pdf",
    fichierSize: "2.8 Mo",
    statut: "evaluation",
    csdAssigne: "CSD Management",
    dateDepot: "2025-03-06",
    dateEnvoi: "2025-03-08",
    dateDecision: null,
    decisionFinale: null,
    messageDirectrice: null,
    evaluations: [],
  },
];

// ── Notifications ──────────────────────────────────────────────────
export const NOTIFICATIONS = {
  "u001": [
    { id: "n001", text: "Votre dossier «Manuel de Gestion Financière» a bien été reçu", date: "Il y a 2h",    unread: true  },
    { id: "n002", text: "Décision rendue : «Impact de la gouvernance...» a été accepté", date: "Il y a 1 jour", unread: true  },
    { id: "n003", text: "Votre dossier a bien été reçu par la Direction",                date: "Il y a 3 jours", unread: false },
  ],
};

// ── Helper functions (simulate API calls) ─────────────────────────

/** Get all dossiers for a given enseignant */
export function getDossiersForUser(userId) {
  return DOSSIERS.filter(d => d.enseignantId === userId);
}

/** Get a single dossier by ID */
export function getDossierById(id) {
  return DOSSIERS.find(d => d.id === id) || null;
}

/** Get all dossiers (for Directrice) */
export function getAllDossiers() {
  return DOSSIERS;
}

/** Get notifications for a user */
export function getNotifications(userId) {
  return NOTIFICATIONS[userId] || [];
}

/** Activate a user account */
export function activateUser(userId) {
  USERS = USERS.map(u => u.id === userId ? { ...u, statut: "actif" } : u);
  return USERS.find(u => u.id === userId);
}

/** Deactivate a user account */
export function deactivateUser(userId) {
  USERS = USERS.map(u => u.id === userId ? { ...u, statut: "inactif" } : u);
  return USERS.find(u => u.id === userId);
}

/** Submit a new dossier */
export function submitDossier(data) {
  const newId = `DOS-2025-${String(DOSSIERS.length + 50).padStart(3, "0")}`;
  const newDossier = {
    id: newId,
    enseignantId: CURRENT_USER.id,
    enseignant: { nom: CURRENT_USER.nom, prenom: CURRENT_USER.prenom, grade: CURRENT_USER.grade, departement: CURRENT_USER.departement, email: CURRENT_USER.email },
    ...data,
    statut: "soumis",
    csdAssigne: null,
    dateDepot: new Date().toISOString().split("T")[0],
    dateEnvoi: null,
    dateDecision: null,
    decisionFinale: null,
    messageDirectrice: null,
    evaluations: [],
  };
  DOSSIERS = [...DOSSIERS, newDossier];
  return newDossier;
}

/** Transfer dossier to a CSD */
export function transferToCSD(dossierId, csdName) {
  DOSSIERS = DOSSIERS.map(d =>
    d.id === dossierId ? { ...d, statut: "envoye_csd", csdAssigne: csdName, dateEnvoi: new Date().toISOString().split("T")[0] } : d
  );
  return getDossierById(dossierId);
}

/** Communicate final decision to enseignant */
export function communicateDecision(dossierId, decision, message) {
  DOSSIERS = DOSSIERS.map(d =>
    d.id === dossierId ? { ...d, statut: "communique", decisionFinale: decision, messageDirectrice: message, dateDecision: new Date().toISOString().split("T")[0] } : d
  );
  return getDossierById(dossierId);
}

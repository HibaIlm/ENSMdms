// ─────────────────────────────────────────────
// theme.js — Shared colors & status config
// Import this in every file that needs colors
// ─────────────────────────────────────────────

export const C = {
  navy:         "#1A3A5C",
  navyDark:     "#0D2137",
  blue:         "#1A6FA8",
  blueLight:    "#2E9CCA",
  bluePale:     "#D6EAF8",
  teal:         "#17748A",
  offWhite:     "#F4F8FC",
  gray100:      "#F0F4F8",
  gray200:      "#DDE6EE",
  gray400:      "#94A3B8",
  gray600:      "#4A6580",
  green:        "#16A34A",
  greenLight:   "#DCFCE7",
  orange:       "#D97706",
  orangeLight:  "#FEF3C7",
  red:          "#DC2626",
  redLight:     "#FEE2E2",
  yellow:       "#CA8A04",
  yellowLight:  "#FEF9C3",
  purple:       "#6D28D9",
  purpleLight:  "#EDE9FE",
  white:        "#FFFFFF",
};

export const STATUS_CONFIG = {
  soumis:      { label: "Soumis",              bg: C.gray200,      text: C.gray600,  icon: "📋" },
  evaluation:  { label: "En évaluation",       bg: C.orangeLight,  text: C.orange,   icon: "⏳" },
  envoye_csd:  { label: "Envoyé au CSD",       bg: C.bluePale,     text: C.blue,     icon: "📤" },
  csd_evalue:  { label: "CSD a évalué",        bg: C.purpleLight,  text: C.purple,   icon: "👥" },
  accepte:     { label: "Accepté",             bg: C.greenLight,   text: C.green,    icon: "✅" },
  refuse:      { label: "Refusé",              bg: C.redLight,     text: C.red,      icon: "❌" },
  corrections: { label: "Corrections dem.",    bg: C.yellowLight,  text: C.yellow,   icon: "🔄" },
  communique:  { label: "Décision rendue",     bg: C.greenLight,   text: C.green,    icon: "📬" },
};

export const CAT_CONFIG = {
  cours:       { icon: "🎓", label: "Cours en ligne",  color: C.blue,  formats: "PDF, PPTX, DOCX" },
  publication: { icon: "📄", label: "Publication",     color: C.teal,  formats: "PDF, DOCX" },
  ouvrage:     { icon: "📚", label: "Ouvrage",         color: C.navy,  formats: "PDF uniquement" },
};

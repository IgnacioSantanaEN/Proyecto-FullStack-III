// ─────────────────────────────────────────────────────────────
// styles/theme.js
// Tokens de diseño centralizados.
// Cambia aquí para actualizar la UI entera.
// ─────────────────────────────────────────────────────────────

export const theme = {
  // Colores de fondo
  bg: {
    base:    "bg-slate-950",   // fondo raíz de la app
    surface: "bg-slate-900",   // sidebar, navbar, cards elevadas
    card:    "bg-slate-800/50",// cards internas, rows hover
    input:   "bg-slate-800",   // inputs
  },

  // Bordes
  border: {
    default: "border-slate-800",
    subtle:  "border-slate-700/50",
    input:   "border-slate-700",
    focus:   "focus:border-blue-500",
  },

  // Texto
  text: {
    primary:   "text-white",
    secondary: "text-slate-400",
    muted:     "text-slate-500",
    accent:    "text-blue-400",
    mono:      "font-mono text-xs",
  },

  // Acento principal
  accent: {
    bg:     "bg-blue-600",
    hover:  "hover:bg-blue-500",
    shadow: "shadow-blue-600/25",
    text:   "text-blue-600",
  },

  // Radios de borde
  radius: {
    sm:  "rounded-lg",
    md:  "rounded-xl",
    full:"rounded-full",
  },

  // Sidebar
  sidebar: {
    expanded:  "w-56",
    collapsed: "w-14",
  },

  // Navbar
  navbar: {
    height: "h-14",
  },

  // Footer
  footer: {
    height: "h-10",
  },
};

// Clase reutilizable para todas las cards
export const cardClass =
  "bg-slate-900 border border-slate-700/80 rounded-[0.875rem] transition-[border-color] duration-200";

// Clase base para botones primarios
export const btnPrimary =
  "flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/25";

// Clase base para inputs
export const inputClass =
  "w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600";

// Tooltip de recharts reutilizable
export const chartTooltipStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  color: "#fff",
};

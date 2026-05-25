// ─────────────────────────────────────────────────────────────
// utils/badges.js
// Funciones puras que devuelven clases Tailwind según estado.
// Sin lógica de negocio, sin JSX.
// ─────────────────────────────────────────────────────────────

/**
 * Devuelve clases Tailwind para el badge de estado de un pedido/envío.
 * @param {string} estado
 * @returns {string}
 */
export function estadoBadgeClass(estado) {
  const map = {
    Entregado:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Enviado:      "bg-blue-500/15 text-blue-400 border-blue-500/30",
    "En tránsito":"bg-blue-500/15 text-blue-400 border-blue-500/30",
    Pendiente:    "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Preparando:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Cancelado:    "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return map[estado] ?? "bg-slate-500/15 text-slate-400 border-slate-500/30";
}

/**
 * Devuelve clases Tailwind para el badge de stock de un producto.
 * @param {string} estado  "Normal" | "Bajo" | "Crítico"
 * @returns {string}
 */
export function stockBadgeClass(estado) {
  if (estado === "Crítico")
    return "bg-red-500/15 text-red-400 border border-red-500/30";
  if (estado === "Bajo")
    return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
  return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
}

/**
 * Color de la barra de progreso de envíos.
 * @param {number} pct  0-100
 * @returns {string}   hex color
 */
export function progressColor(pct) {
  if (pct === 100) return "#22c55e";
  if (pct > 50)   return "#3b82f6";
  return "#f59e0b";
}

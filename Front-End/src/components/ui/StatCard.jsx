// ─────────────────────────────────────────────────────────────
// components/ui/StatCard.jsx
// Tarjeta de métrica reutilizable para el Dashboard.
// Props: icon, label, value, delta (número), color (bg-*), sub
// ─────────────────────────────────────────────────────────────

import { TrendingUp, TrendingDown } from "lucide-react";
import { cardClass } from "../../styles/theme";

export default function StatCard({ icon: Icon, label, value, delta, color, sub }) {
  const isPositive = delta >= 0;

  return (
    <div className={`${cardClass} p-5 flex flex-col gap-3`}>
      {/* Ícono + tendencia */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold
            ${isPositive ? "text-emerald-400" : "text-red-400"}`}
        >
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isPositive ? "+" : ""}{delta}%
        </span>
      </div>

      {/* Valor principal */}
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-slate-400 text-sm mt-0.5">{label}</p>
        {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}
